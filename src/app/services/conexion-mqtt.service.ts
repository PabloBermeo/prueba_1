import { Injectable } from '@angular/core';
import { PeticionesHttpService } from './peticiones-http.service';
import { IMqttServiceOptions, MqttService } from 'ngx-mqtt';
import { MQTT_SERVICE_OPTIONS, environment } from 'src/environments/environment';
import { UiServiceService } from './ui-service.service';
import { EventBusService } from './event-bus.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';

const URL=environment.url;

@Injectable({
  providedIn: 'root'
})
export class ConexionMqttService {
  nameUser:string=this._peticionesHttp.user.name;
  client: MqttService |undefined;
  isConnection=false;
  endpoint='/mqtt';
  connectUrl='';
  private subscriptions:Map<string,Subscription>=new Map();
  private deviceSubscribeTopic= "";
  private notifSubscribeTopic= "";
  connection:IMqttServiceOptions={
    host: MQTT_SERVICE_OPTIONS.hostname,
    port: MQTT_SERVICE_OPTIONS.port,
    path: MQTT_SERVICE_OPTIONS.path,
    clean: true,
    keepalive:900,
    connectTimeout: 5000,
    reconnectPeriod: 5000,
    clientId: "web_"+this.nameUser+"_"+Math.floor(Math.random()*10000+1),
    username:'',
    password: '',
    protocol: MQTT_SERVICE_OPTIONS.protocol
  }
  constructor(private _peticionesHttp:PeticionesHttpService,
              private _mqttService:MqttService,
              private _uiService:UiServiceService,
              private _eventBus:EventBusService,
              private http:HttpClient
  ) { 
    this.client=this._mqttService;
  }

  async getMqttCredentials(){
    try {
      const token1=this._peticionesHttp.x_token();
      if(token1.length<2){this.disconectMqtt();return Promise.resolve(false);}
      const header=new HttpHeaders({'x-token':this._peticionesHttp.x_token()});
      return await new Promise<boolean>(resolve=>{
        this.http.get(`${URL}/user/getmqttcredentials`,{headers:header})
              .subscribe(credentials=>{
               // console.log('credentials:',credentials);
                if(credentials['ok']){
                  this.connection.username=credentials['username'];
                  this.connection.password=credentials['password'];
                  resolve(true);
                }else{
                  console.log('*******************ERROR en getMqttCredentials************');
                  resolve(false);
                }
              })
      })
    } catch (error) {
      console.error('*******************ERROR desconocido en getMqttCredentials************');
      console.log(error);
      return Promise.resolve(false);

    }
  }

  async getMqttCredentialsForReconnection(){
    try {
      const token1=this._peticionesHttp.x_token();
      if(token1.length<2){this.disconectMqtt();return Promise.resolve(false);}

      const header=new HttpHeaders({'x-token':this._peticionesHttp.x_token()});
      return await new Promise<boolean>(resolve=>{
        this.http.get(`${URL}/user/getmqttcredentialsforreconnection`,{headers:header})
              .subscribe(credentials=>{
                //console.log('credentials-forReconnection:',credentials);
                if(credentials['ok']){
                  this.connection.username=credentials['username'];
                  this.connection.password=credentials['password'];
                  resolve(true);
                }else{
                  console.log('*******************ERROR en getMqttCredentialsForReconnection************');
                  resolve(false);
                }
              })
      })
    } catch (error) {
      console.error('*******************ERROR desconocido en getMqttCredentialsForReconnection************');
      console.log(error);
      return Promise.resolve(false);

    }
  }
  actualizaConnection(){
    this.connection.clientId="web_"+this.nameUser+"_"+Math.floor(Math.random()*10000+1);
    this.connection.host=MQTT_SERVICE_OPTIONS.hostname;
    this.connectUrl=MQTT_SERVICE_OPTIONS.protocol+'://'+this.connection.host+":"+this.connection.port+this.endpoint;
  }
subscribir_sdata_notif(){
  const _id=this._peticionesHttp.user._id;
  this.deviceSubscribeTopic= _id+"/+/+/sdata";
  this.notifSubscribeTopic= _id+"/+/+/notif";
  const Topicos=[this.deviceSubscribeTopic,this.notifSubscribeTopic];
  //SUBCRIBIR a sdata
  for(let topico_ of Topicos){
    if(!this.subscriptions.has(topico_) && this.client!== undefined){
      console.log('topic:',topico_);
      const subscription_=this.client!.observe(topico_,{qos:0})
                          .subscribe({next:(message)=>{
                            console.log('Observe->Topic:',topico_);
                            console.log('Observe->Mensaje en sdata:',message.payload.toString());
                            
                          },error:error=>{
                            console.error('Error en subscripción a Topic:',topico_, ' Error: ',error);
                          }});
      this.subscriptions.set(topico_,subscription_);
    }
  }
  
}
  async startMqttClient(){
    //console.error('Iniciando starMqttClient()...., username:',this._peticionesHttp.user.name);
    if(!this._peticionesHttp.isAuthenticated()||this._peticionesHttp.user.name===undefined ||this._peticionesHttp.user.name.length===0 )
      { this.isConnection=false;
        console.error('No esta autenticado, o no extá definido el usuario');
        this.disconectMqtt();return;}
    this.nameUser=this._peticionesHttp.user.name;
    this.actualizaConnection();
    await this.getMqttCredentials().then(resp=>{
      if(resp){
        console.log('credenciales actualizadas');
      }else{
        console.warn('Error en lectura de credenciales....');
      }
    });
    
   

    try {
      this.client=this._mqttService;
      this.client.connect(this.connection);
    } catch (error) {
      console.error('ERROR en mqtt.connect:',error);
      
    }
    this.client?.onConnect.subscribe(()=>{
      this.isConnection=true;
      console.log('Conexión exitosa, clientId:',this.client?.clientId);
      this.subscribir_sdata_notif();
     // console.log('MENSAJE luego de subscribir..................:');
    });

    this.client?.onError.subscribe((error)=>{
      this.isConnection=false;
      console.error('Conexión fallida:',error);
    })
    

   // this.subscribir_sdata_notif();
    //RECONEXION MQTT
    this.client?.onReconnect.subscribe((msn1)=>{
      console.warn('En onReconnect:',msn1);
      this.actualizaConnection();
      this.getMqttCredentialsForReconnection().then(resp=>{
        if(resp){
          console.log('Reconectando...');
        }else{
          console.error('Error en obtención de credenciales para Reconexion');
        }
      })
    },async err=>{
      console.error("Error en onReconnect",err);
      await this.getMqttCredentialsForReconnection();
    })

    //proceso para administrar la desconexión:
    this.client?.onClose.subscribe(()=>{
      console.log('onClose->Desconectado del MQTT');
    })
    //Lectura de MENSAJES del TOPIC sdata y notif
    this.client?.onMessage.subscribe(async(mensaje:any)=>{
      console.log('Mensaje Rx:'+mensaje.payload.toString()+"->del topic:"+mensaje.topic);
      try {
         const split_Topic=mensaje.topic.split('/');
         const msnType=split_Topic[3];
         console.log('split_Topic',split_Topic);
         if(msnType== "notif"){
          this._uiService.toastWarning(mensaje.payload.toString());
          await this._peticionesHttp.getNotifications();
          return
         }else if(msnType=="sdata"){
            this._eventBus.emit(mensaje.topic,mensaje.payload.toString());
            return;
         }else{
          this._uiService.toastWarning('!!!Type: '+msnType+ ' is wrong, message:'+mensaje.payload.toString());
         }

      } catch (error) {
        console.error('Error en onMessage.subscribe:',error);
        this._uiService.toastWarning('Error desconocido en onMessage.subscribe');
      }
    })

    this._eventBus.on('mqtt-sender').subscribe(toSend=>{
      console.log('********************_eventBus.on************************');
      console.warn('toSend');
      this.client?.unsafePublish(toSend.topic,JSON.stringify(toSend.msg),{qos:0});
    });

  }

  unsubscribeFromTopic(topic:string):void{
    const subscription=this.subscriptions.get(topic);
    if(subscription){
      subscription.unsubscribe();
      this.client?.observe(topic).subscribe().unsubscribe();
      this.subscriptions.delete(topic);
      console.log(`Unsubscribe del topic:${topic}`);
    }else{
      console.error(`Ninguna subscripción encontrada con el topic:${topic}`);
    }
  }
  disconectMqtt(){
    if(this.client && !this.client.state.closed){
      this.subscriptions.forEach((subscription1,topic)=>{
        this.unsubscribeFromTopic(topic);
      });
      this.client?.disconnect(true);
      this.isConnection=false;
      console.log('disconectMqtt()...');
    }
  }
}

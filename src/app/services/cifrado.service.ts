import { Injectable } from '@angular/core';
import { MQTT_SERVICE_OPTIONS,environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import {PeticionesHttpService} from './peticiones-http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';




const URL=environment.url;

@Injectable({
  providedIn: 'root'
})
export class CifradoService {

  constructor(private _http:HttpClient,
              private _peticionesHttp:PeticionesHttpService
  ) { }

  //Encriptar text plano con una clave secreta
  encriptarTexto(plainText:string, secretKey:string):string{
    const textoEncriptado=CryptoJS.AES.encrypt(plainText,secretKey).toString();
    return textoEncriptado;
  }

  //Descencriptar texto codificado con una clave secreta
  descencriptarTexto(textCifrado:string, data_iv:string):any{
    const ivBuffer=CryptoJS.enc.Hex.parse(data_iv);
    const claveSecreta='la-clave-es-IoT-p65-1234567890';
    const bytesDescifrados=CryptoJS.AES.decrypt(textCifrado,claveSecreta,
      {
        iv:ivBuffer,
        mode:CryptoJS.mode.CBC,
        padding:CryptoJS.pad.Pkcs7
      }
    )
    const texto=JSON.parse(bytesDescifrados.toString(CryptoJS.enc.Utf8));
    var data={
      backend_host:'',
      mongo_host:'',
      mqtt_host:'',
      mqtt_port:'',
      mqtt_SSL_protocol:''
    };
    if(texto['ok']){
      data.backend_host=texto['backend_host'];
      data.mongo_host=texto['mongo_host'];
      data.mqtt_host=texto['mqtt_host'];
      data.mqtt_port=texto['mqtt_port'];
      data.mqtt_SSL_protocol=texto['mqtt_SSL_port'];
    }
    return data;
  }

  async variablesGlobales(){
    try {
      let header=new HttpHeaders({'x-token':this._peticionesHttp.x_token()});
      return new Promise<boolean>(resolve=>{
        this._http.get(`${URL}/user/variables`,{headers:header}).subscribe(resp=>{
          if(resp['ok']){
            const data=this.descencriptarTexto(resp['encriptado'],resp['iv']);
            //console.log('Mensaje descencriptado:',data);
            environment.url=data['backend_host'];
            MQTT_SERVICE_OPTIONS.hostname=data['mqtt_host'];
            MQTT_SERVICE_OPTIONS.port=data['mqtt_port'];
            MQTT_SERVICE_OPTIONS.protocol=data['mqtt_SSL_protocol'];
            console.log('cifrado->MQTT->hostname',MQTT_SERVICE_OPTIONS.hostname);
            resolve(true);
            

          }else{
            console.error('No se completó la actualización de Variables GLOBALES');
            console.log('resp:',resp);
            resolve(false);
          }
        })
      });
    } catch (error) {
      console.error('ERROR en lectura de Variables GLOBALES',error);
      return Promise.resolve(false);
    }
  }
}

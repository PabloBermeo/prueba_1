import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UiServiceService } from './ui-service.service';
import { IDevice, INotification, IRules, IRulesAlarm, ITemplates } from './clases.models';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

const URL=environment.url;
export interface User{
  avatar?:string;
  _id?:string;
  nombre?:string;
  email?:string;
  password?:string;
}
@Injectable({
  providedIn: 'root'
})
export class PeticionesHttpService {
  private token:string='';
  user:any={};
  expiresIn:number=0;
  devices:IDevice[]=[];
  templates:ITemplates[]=[];
  notifications:INotification[]=[];
  private notificationsPublic=new BehaviorSubject<INotification[]>([]);
  private deviceSelected=new BehaviorSubject<number>(-1);
  private devicesPublic=new BehaviorSubject<IDevice[]>([]);

  x_token(){
    return JSON.parse(JSON.stringify(this.token));
  }
  notificationsAsObservable(){
    return this.notificationsPublic.asObservable();
  }
  setNotificationsPublic(notification:INotification[]){
    this.notificationsPublic.next(notification);
  }

  getDeviceSelected(){
    return this.deviceSelected.asObservable();
  }
  setDeviceSelected(newDato:number){
    this.deviceSelected.next(newDato);
  }

  devicesAsObservable(){
    return this.devicesPublic.asObservable();
  }


  constructor(private http:HttpClient,
              private _uiService:UiServiceService,
              private router:Router
  ) { }

  guardarToken(token:string,expiresIn:number){
    this.token=token;
    this.expiresIn=expiresIn;
    localStorage.setItem('token',token);
    localStorage.setItem('expiresIn',this.expiresIn.toString());
  }

  cargarToken(){
    if(!this.token){
      this.token=localStorage.getItem('token')||'';
      this.expiresIn=Number(localStorage.getItem('expiresIn') || '0');
    }
    try {
      if(this.token===''){
        return Promise.resolve(false);
      }
      let headers=new HttpHeaders({'x-token':this.token});
      return new Promise(resolve=>{this.http.get(`${URL}/user/`,{headers})
          .subscribe(resp=>{
            if(resp['ok']){
              this.user=resp['usuario'];
              resolve(true);
            }
            else{
              this.logOut();//this.user=undefined;
              resolve(false);
            }
            console.log('CARGAR TOKEN, User:',this.user);
  
          });  
        });
    } catch (error) {
      console.error('Error en CARGARTOKEN()',error);
      return Promise.resolve(false);
    }
    
  }

  isAuthenticated():boolean{
      this.cargarToken();
      if(!this.token || this.token===undefined ||this.token==='undefined') return false;
      if(this.token.length<10) return false;
      //console.log('Date.now()',Date.now(),'--expiresIn:',this.expiresIn);return true;
      const timeOk= this.expiresIn >=(Date.now()/1000);
      if(timeOk){
        return true;
      }else{
        this.token='';
        localStorage.clear();
        this._uiService.alertaError('Token inválido');
        return false;
      }
  }

  login(email:string,password:string){
    const data={email,password};
   // console.log('INICIANDO LOGIN');
    return new Promise(resolve=>{
      this.http.post(`${URL}/user/login`,data)
      .subscribe(resp=>{
        //console.log('En Login:',resp);
        if(resp['ok']){
          this.guardarToken(resp['token'],resp['expiresIn']);
          resolve(true);
        }else{
          this.token='';
          localStorage.clear();
          this._uiService.alertaError(resp['mensaje']);
          resolve(false);
        }
      });
    });
    
  }

  register(usuario:User){
    
    return new Promise(resolve=>{
      try {
        this.http.post(`${URL}/user/create`,usuario)
      .subscribe(resp=>{
        console.log('En Register:',resp);
        if(resp['ok']){
          this.guardarToken(resp['token'],resp['expiresIn']);
          resolve(true);
        }else{
          this.token='';
          localStorage.clear();
          this._uiService.alertaError(resp['err'].errors.email.message);
          resolve(false);
        }
      });
      } catch (error) {
        console.log('Error en register/creacion usuario:',error);
        this._uiService.alertaError('Error en register desconocido');
        resolve(false);
        
      }
    });
    
  }

  logOut(){
    localStorage.clear();
    this.token="";
    this.expiresIn=0;
    this.user={nombre:""};
    this.templates=[];
    this.devices=[]
    this.notifications=[];
    this.devicesPublic.next([]);
    this.notificationsPublic.next([]);
    this.router.navigateByUrl('/login');
  }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MANEJO DE DEVICES
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
getDevices():Promise<IDevice[]>{
  const header=new HttpHeaders({'x-token':this.token});
  return new Promise<IDevice[]>(resolve=>{
    this.http.get(`${URL}/api/device`,{headers:header})
    .subscribe(resp=>{
      console.log('En getDevices():',resp);
      let devices:IDevice[]=[];
      if(resp['deviceDB'])
        devices=resp['deviceDB'];
      this.devices=devices;
      
      this.deviceSelected.next(-1);
      this.devicesPublic.next(this.devices);
      resolve(this.devices);
    });
  }); 
}

async readDevices():Promise<IDevice[]>{
  if(this.devices.length===0){
    await this.getDevices();
  }
  return this.devices;
}

addDevice(device:IDevice,template:ITemplates):Promise<boolean>{
  const header=new HttpHeaders({'x-token':this.token});
  try {
    return new Promise<boolean>(resolve=>{
      const data:IDevice={
        dId:device.dId,
        name:device.name,
        templateId:template._id,
        templateName:template.name
      };
      this.http.post(`${URL}/api/device`,data,{headers:header})
        .subscribe(resp=>{
          if(resp['ok']){
            this.devices.push(data);
            this.deviceSelected.next(-1);
            this.devicesPublic.next(this.devices);
            return resolve(true);
          }else{
            let msn1=resp['mensaje']!==undefined?resp['mensaje']:'Error en AddDevice desconocido'
            this._uiService.alertaError(msn1);
            return resolve(false);
            }
        })
    })
  } catch (error) {
    console.error('ERROR: en addDevice',error);
    this._uiService.alertaError('Error en addDevice.'+error);
    return Promise.resolve(false);
  }
}
deleteDevice(device:IDevice):Promise<boolean>{
  const header=new HttpHeaders({'x-token':this.token});
  return new Promise<boolean>((resolve,reject)=>{
    console.log('DELETE_DEVICE: device:',device);
    if(device.alarmRules === undefined ||(device.alarmRules !== undefined && device.alarmRules!.length>0)){
      return reject(`ERROR: el device:"${device.name}" tiene ${device.alarmRules!.length} alarmas`);
    }
    this.http.delete(`${URL}/api/device`,{headers:header,params:{dId:device.dId}})
          .subscribe(resp=>{
            if(resp['ok']){
              this.devices=this.devices.filter(device1=> device1.dId !== device.dId);
              this.deviceSelected.next(-1);
              this.devicesPublic.next(this.devices);
              resolve(true);
            }
            else  
              resolve(false);
          });
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MANEJO DE TEMPLATES
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
  saveTemplate(template:ITemplates):Promise<Boolean>{
   const header=new HttpHeaders({'x-token':this.token});
   try {
    return new Promise<boolean>(resolve=>{
      this.http.post(`${URL}/widgets/template`, {template},{headers:header})
                  .subscribe(resp=>{
                    if(resp['ok']){
                      this.templates.push(resp['templates']);
                      return resolve(true);
                    }else{
                      return resolve(false);
                    }
                  })
    });
   } catch (error) {
    console.error('ERROR en saveTemplate');
    this._uiService.alertaError('Error en saveTemplate'+error);
    return Promise.resolve(false);
    
   }
  }

  getTemplates():Promise<ITemplates[]>{
    const header=new HttpHeaders({'x-token':this.token});

    return new Promise<ITemplates[]>(resolve=>{
      this.http.get(`${URL}/widgets/template`,{headers:header})
                .subscribe(resp=>{
                  let templates:ITemplates[]=[];
                  if(resp['templateDB'])
                    templates=resp['templateDB'];
                  this.templates=templates;
                  resolve(this.templates);
                })
    }); 
  }

  async readTemplates():Promise<ITemplates[]>{
    if(this.templates.length===0){
      await this.getTemplates();
    }
    return this.templates;
  }

  deleteTemplate(template:ITemplates){
    const header=new HttpHeaders({'x-token':this.token});
    return new Promise<Boolean>((resolve,reject)=>{
      for(let deviceT of this.devices){
        if(deviceT.templateId=== template._id){
          return reject(`Error, el device:"${deviceT.name}" usa el template:"${template.name}"`);
        }  
      }
      this.http.delete(`${URL}/widgets/template`,{headers:header,body:{idTemplate:template._id}})
                  .subscribe(resp1=>{
                    if(resp1['ok']){
                      return resolve(true);
                    }else{
                      return resolve(false);
                    }
                  })
    });
  }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MANEJO DE SAVERRULES
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
 updateSaverRuleStatus(rule:IRules){
  var ruleCopy:IRules=JSON.parse(JSON.stringify(rule));
  try {
      ruleCopy.status=!ruleCopy.status;
      const headers=new HttpHeaders({'x-token':this.token});
      return new Promise<boolean>(resolve=>{
        this.http.put(`${URL}/api/saver-rule`,{rule:ruleCopy},{headers:headers})
            .subscribe(resp=>{
              if(resp['ok']){
                console.log('Actualización de SaerRule ok:'+ruleCopy.emqxRuleId);
                return resolve(true);
              }else{
                this._uiService.alertaError('NO se actualizó SaverRule:'+ruleCopy.emqxRuleId);
                return resolve(false);
              }
            })
      })
  } catch (error) {
    console.log('Error un updateSaverRule:',error);
    this._uiService.alertaError('ERROR desconocido en actualizacion de SaverRule:'+ruleCopy.emqxRuleId);
    return Promise.resolve(false);
  }
 }

 /////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MANEJO DE ALARM-RULES
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
addAlarmRule(rule:IRulesAlarm):Promise<boolean>{
  const header=new HttpHeaders({'x-token':this.token});
  try {
    return new Promise<boolean>(resolve=>{
      const data={
        newRule:rule
      }
      this.http.post(`${URL}/alarm/alarm-rule`,data,{headers:header})
            .subscribe(resp=>{
              if(resp['ok']){
                rule.emqxRuleId=resp['emqxRuleId'];
                const rule1=JSON.parse(JSON.stringify(rule));
                this.devices[this.deviceSelected.getValue()].alarmRules?.push(rule1);
                return resolve(true);
              }else{
                this._uiService.alertaError('Error in Add Alarm Rule');
                return resolve(false);
              }
            });
    });
  } catch (error) {
    console.log('ERROR DESCONOCIDO en petición HTTP addAlarmRule, error:',error);
    this._uiService.alertaError('ERROR DESCONOCIDO en peticiones_HTTP addAlarmRule');
    return Promise.resolve(false);
  }
}

deleteAlarmRule(rule:IRulesAlarm):Promise<boolean>{
  const header=new HttpHeaders({'x-token':this.token});
  try {
    return new Promise<boolean>(resolve=>{
      this.http.delete(`${URL}/alarm/alarm-rule`,{headers:header,body:{emqxRuleId:rule.emqxRuleId}})
                  .subscribe(resp=>{
                    if(resp['ok']){
                      const posD=this.deviceSelected.getValue();
                      this.devices[posD].alarmRules=this.devices[posD].alarmRules?.filter(alar=>alar.emqxRuleId!==rule.emqxRuleId);
                      this.devicesPublic.next(this.devices);
                      return resolve(true);
                    }else{
                      if(resp['mensaje']){
                        this._uiService.alertaError(resp['mensaje']);
                      }else{
                        this._uiService.alertaError('Error en Delete AlarmRule');
                      }
                      return resolve(false);
                    }
                  })
    });
  } catch (error) {
    console.error('***********ERROR DESCONOCIDO en Delete AlarmRule********',error);
    this._uiService.alertaError('Error desconocido en Delete AlarmRule');
    return Promise.resolve(false);
  }
}

updateAlarmRule(rule:IRulesAlarm):Promise<boolean>{
  const headers=new HttpHeaders({'x-token':this.token});
  const header=new HttpHeaders({'x-token':this.token});
  console.warn('x-token:'+this.token);
  try {
    return new Promise<boolean>(resolve=>{
      var ruleCopy=JSON.parse(JSON.stringify(rule));
      ruleCopy.status=!ruleCopy.status;
      //const params={rule:ruleCopy};
      this.http.put(`${URL}/alarm/alarm-rule`,{rule:ruleCopy},{headers:header})
                  .subscribe(resp=>{
                    if(resp['ok']){
                      const alarma1=this.devices[this.deviceSelected.getValue()].alarmRules?.find(al=>al.emqxRuleId===rule.emqxRuleId);
                      if(alarma1){
                        alarma1.status=!alarma1.status;
                      }
                      return resolve(true);
                    }else{
                      if(resp['mensaje']){
                        this._uiService.alertaError(resp['mensaje']);
                      }else{
                        this._uiService.alertaError('Error en Update Alarm');
                      }
                      return resolve(false);
                    }
                  })
    })
  } catch (error) {
    console.error('***********ERROR DESCONOCIDO en UPDATE AlarmRule********',error);
    this._uiService.alertaError('Error desconocido en Update AlarmRule');
    return Promise.resolve(false);
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MANEJO DE NOTIFICACIONES
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
getNotifications(){
  const header=new HttpHeaders({'x-token':this.token});
  try {
    return new Promise<INotification[]>(resolve=>{
      this.http.get(`${URL}/webhook/notifications`,{headers:header})
        .subscribe(resp=>{
          if(resp['ok']){
            let notifications:INotification[]=[];
            if(resp['data']){
              notifications=resp['data'];
            }
            this.notifications=notifications;
            this.notificationsPublic.next(this.notifications);
            resolve(this.notifications);
          }else{
            this.notifications=[];
            this.notificationsPublic.next(this.notifications);
            this._uiService.alertaError('Error desconocido en getNotifications');
            resolve([]);
          }
        })
    })
  } catch (error) {
    console.error('ERROR desconocido en peticiones-http, error:',error);
    this._uiService.alertaError('Error desconocido en getNotifications v1');
    return Promise.resolve([]);
  }
}

updateNotification(i:number,_id:string){
  const header=new HttpHeaders({'x-token':this.token});
  try {
    return new Promise<boolean>(resolve=>{
      this.http.put(`${URL}/webhook/notifications`,{notifId:_id},{headers:header})
            .subscribe(resp=>{
              if(resp['ok']){
                this.notifications.splice(i,1);
                this._uiService.toastSuccess('Notification:'+_id+' was updated');
                return resolve(true);
              }else{
                this._uiService.alertaError('Error in Notification:'+_id);
                return resolve(false);
              }
            })
    });
  } catch (error) {
    console.error('ERROR desconocido en peticiones-http en update notification, error:',error);
    this._uiService.alertaError('Error desconocido en updateNotifications v1');
    return Promise.resolve(false);
  }
}

}

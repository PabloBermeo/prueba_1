import { Component } from '@angular/core';
import { IDevice, ITemplates } from 'src/app/services/clases.models';
import { PeticionesHttpService } from 'src/app/services/peticiones-http.service';
import { UiServiceService } from 'src/app/services/ui-service.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styles: [
  ]
})
export class DevicesComponent {
  templates:ITemplates[]=[];
  device:IDevice={name:'',dId:'',saverRule:{userId:'',dId:''}};

  templateSelected=-1;
  devices:IDevice[]=[
    {
      name:"Home",
      dId:"5551",
      password:"z87654321",
      templateName: "Power Sensor",
      templateId:"asdfghjklñ1",
     // saverRule:false
    },
    {
      name:"Office",
      dId:"5552",
      password:"y87654321",
      templateName: "Power Sensor",
      templateId:"asdfghjklñ1",
      //saverRule:false
    },
    {
      name:"Facilities",
      dId:"5553",
      password:"x87654321",
      templateName: "Sensor 3",
      templateId:"asdfghjklñ3",
      //saverRule:false
    },
  ]
  constructor(private _peticionesHttp:PeticionesHttpService,
              private _uiServices:UiServiceService
  ){  
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this._peticionesHttp.readTemplates().then(templates1=>{
      this.templates=templates1;
    })    
    this.devices=[];
    this._peticionesHttp.getDevices().then(devices=>{
      this.devices=devices;
    });
  
  }
  deleteDevice(pos:number){
    console.log('Selected Device is:',pos);
    this._peticionesHttp.deleteDevice(this.devices[pos])
              .then(resp=>{
                if(resp)
                  this.devices.splice(pos,1);
                else
                  this._uiServices.alertaError('No se pudo eliminar Device:'+this.devices[pos].name);
              }).catch(err=>{
                this._uiServices.alertaError(err);
              })
  }
  limpiarDatoDevice(){
    this.device.name='';
    this.device.dId='';
    this.templateSelected=-1;
  }
  addDevice(){
    if((this.device.name.length>0)&&(this.templateSelected>=0)&&this.device.dId.length>0){
      //console.log('addDevice, templateSelected:',this.templateSelected);
      //console.log('addDevice, deviceNew:',this.device);
      const _userId=JSON.parse(JSON.stringify(this.templates[this.templateSelected].userId));
      const dId=JSON.parse(JSON.stringify(this.device.dId));
console.error('this.device:',this.device);
      this.device.saverRule!.dId=dId;
      this.device.saverRule!.userId=_userId;
      this.device.saverRule!.status=true;

      this.device.templateId=JSON.parse(JSON.stringify(this.templates[this.templateSelected]._id));
      this.device.templateName=JSON.parse(JSON.stringify(this.templates[this.templateSelected].name));
      this.device.template=JSON.parse(JSON.stringify(this.templates[this.templateSelected]));
      this.device.template!.userId=_userId;

      this._peticionesHttp.addDevice(this.device,this.templates[this.templateSelected])
                    .then(async respOk=>{
                      if(respOk){
                        this.device.templateName=this.templates[this.templateSelected].name;
                        await this.getDevices();
                        this.limpiarDatoDevice();  
                      }else{
                        console.log('No se pudo adicionar device, respuesta:',respOk);
                      }
                    })
    }else{
      console.error('ERROR: Valores no validos para device o Template');
      this._uiServices.alertaError('Valores no válidos de Template o Device:'+this.device.name);
    }
  }
  updateSaverRule(id:number){
    //this.devices[id].saverRule=!this.devices[id].saverRule;
    const nameD=this.devices[id].name;
    if(this.devices[id].saverRule===undefined){
      this._uiServices.alertaInformativa('No existe SaverRule del Dispositivo:'+nameD);
      return;
    }
    this._peticionesHttp.updateSaverRuleStatus(this.devices[id].saverRule!).then(resp=>{
      if(resp){
        console.log('Se modifico el dispositivo:'+nameD);
        this.devices[id].saverRule!.status= !this.devices[id].saverRule!.status;
        console.log('Nuevos datos del dispositivo:',this.devices[id]);

      }else{
        console.log('ERROR en actualización de SaverRule:',this.devices[id].saverRule);
      }
    })
  }
  async getDevices(){
    await this._peticionesHttp.getDevices().then(devices1=>{
      this.devices=devices1;
      console.log('getDevices():',this.devices);
    })
  }
  status(id:number){
    if(this.devices[id].saverRule===undefined){
      return false;
    }else{
      return this.devices[id].saverRule!.status;
    }
  }
}

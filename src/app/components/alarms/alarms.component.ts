import { Component } from '@angular/core';
import { IConfigW, IDevice, IRulesAlarm } from 'src/app/services/clases.models';
import { PeticionesHttpService } from 'src/app/services/peticiones-http.service';
import { UiServiceService } from 'src/app/services/ui-service.service';

@Component({
  selector: 'app-alarms',
  templateUrl: './alarms.component.html',
  styles: [
  ]
})
export class AlarmsComponent {
  selectedWidgetIndex:number=-1;
  selectedDeviceIndex:number=-1;
  devices:IDevice[]=[];
  alarmRules:IRulesAlarm[]=[];
  newRule:IRulesAlarm={};

  constructor(private _peticionesHttp:PeticionesHttpService,
              private _uiService:UiServiceService
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this._peticionesHttp.devicesAsObservable().subscribe(disp=>{
      this.devices=disp;
    });
    this._peticionesHttp.getDeviceSelected().subscribe(valor=>{
      this.selectedDeviceIndex=valor;
      this.alarmRules=[];
      if(this.selectedDeviceIndex!==-1 && this.devices[this.selectedDeviceIndex].alarmRules !== undefined && this.devices[this.selectedDeviceIndex].alarmRules!.length>0){
        this.alarmRules=JSON.parse(JSON.stringify(this.devices[this.selectedDeviceIndex].alarmRules));
      }

    });
  }

  createAlarmRule(){
    if(this.selectedDeviceIndex==-1){
      this._uiService.alertaInformativa('Device must be selected');
      return;
    }
    if(this.selectedWidgetIndex==-1){
      this._uiService.alertaInformativa('Widget/variable must be selected');
      return;
    }
    if((this.newRule.condition===undefined)||(this.newRule.condition!.length===0)){
      this._uiService.alertaInformativa('Condition must be selected');
      return;
    }
    if(this.newRule.value===undefined){
      this._uiService.alertaInformativa('The Value must be defined');
      return;
    }
    if(this.newRule.triggerTime===undefined){
      this._uiService.alertaInformativa('The "Update Cycle" must be defined');
      return;
    }
    const widget1:IConfigW=this.devices[this.selectedDeviceIndex].template!.widgets![this.selectedWidgetIndex];
    const dev_1=this.devices[this.selectedDeviceIndex];
    this.newRule.dId=dev_1.dId;
    this.newRule.deviceName=dev_1.name;
    this.newRule.variableFullName=widget1.variableFullName;
    this.newRule.variable=widget1.variable;
    this.newRule.counter=0;
    this.newRule.status=true;

    this._peticionesHttp.addAlarmRule(this.newRule).then(resp=>{
      if(resp){
        this._uiService.toastSuccess('New Alarm created successfully');
        this.alarmRules.push(JSON.parse(JSON.stringify(this.newRule)));
        this.newRule={dId:"", status:true};
      }
    })
  }

  deleteAlarmRule(nAlarm:number){
    console.log('Se eliminará alarma:',nAlarm);
    this._peticionesHttp.deleteAlarmRule(this.alarmRules[nAlarm]).then(resp=>{
      if(resp){
        this._uiService.toastSuccess('AlarmRule:'+this.alarmRules[nAlarm].emqxRuleId+' was deleted');
        this.alarmRules.splice(nAlarm,1);
      }else{
        this._uiService.toastWarning('Error in delete Alarm:'+this.alarmRules[nAlarm].emqxRuleId);
      }
    });
  }
  updateAlarmRule(nAlarm:number){
    console.log('Se actualizará alarma:',nAlarm);
    this._peticionesHttp.updateAlarmRule(this.alarmRules[nAlarm]).then(resp=>{
        if(resp){
          this.alarmRules[nAlarm].status=!this.alarmRules[nAlarm].status;
          this._uiService.toastSuccess('Alarm:'+this.alarmRules[nAlarm].emqxRuleId+' was UPDATED');
        }else{
          this._uiService.toastWarning('ERROR in Updated Alarm:'+this.alarmRules[nAlarm].emqxRuleId);
        }
    }).catch(err=>{
      this._uiService.alertaError('ERROR in Update Alarm');
      console.error('ERROR:',err);
    });
  }

  status(nAlarm:number){
    if(this.alarmRules[nAlarm]!== undefined)
      return this.alarmRules[nAlarm].status;
    else
      return false;
  }

}

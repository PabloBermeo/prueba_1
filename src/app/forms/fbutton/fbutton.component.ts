import { Component, EventEmitter, Output } from '@angular/core';
import { MngWidgetsService } from 'src/app/services/mng-widgets.service';
import { IConfigW } from 'src/app/services/clases.models';

@Component({
  selector: 'app-fbutton',
  templateUrl: './fbutton.component.html',
  styles: [
  ]
})
export class FbuttonComponent {
  @Output() config=new EventEmitter<IConfigW>();
  clases=['success','primary','warning','danger'];
  columnsWidth=['col-3','col-4','col-5','col-6','col-7','col-8','col-9','col-10',
          'col-11','col-12'];
  
  buttonConfig:IConfigW={
    userId:'',
    selectedDevice:{
      name:'',
      dId:'',
     // template:'',
      templateId:'',
      //saverRule:false
    },
    chartTimeAgo:0,
    variableFullName:'',
    variable:'',
    variableType:'output',
    variableSendFreq:10,
    unit:'',
    icon:'fa-sun',
    column:'col-6',
    widget:'',
    class:'success',
    message:"",
    //demo:true,
    decimalPlaces:0,
    text:''
  }
  constructor(private _mngWidget:MngWidgetsService){
    this.buttonConfig.widget=this._mngWidget.readTypeWidgets(4);
  }
  sendConfig(){
    
    //console.log('datos widget-config:',this.buttonConfig);
    this.config.emit(this.buttonConfig);
  }
}

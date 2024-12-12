import { Component, Input, SimpleChanges } from '@angular/core';
import { EventBusService } from 'src/app/services/event-bus.service';

@Component({
  selector: 'app-iotindicator',
  templateUrl: './iotindicator.component.html',
  styles: [
  ]
})
export class IotindicatorComponent {
  @Input() config:any;
  topic_ini="";
  value=false;
  /*config={
    userId:'id-user',
    selectedDevice:{
      name:"Home",
      did:"5551",
      password:"z87654321",
      templateName: "Power Sensor",
      templateId:"asdfghjklñ1",
      saverRule:false
    },
    variableFullName:"Pump",
    variable:"str_unique",
    icon:"fa-sun",
    column:"col-6",
    widget:'indicator',
    class:'primary'

  }*/
  constructor(private _eventBusService:EventBusService){}
  getIconColor():string{
    return this._eventBusService.getIconColor(!this.value,this.config);
  }

  processReceiveData(data_1:any){
    try{
      //console.log('Data_1 recibidos:',data_1);
      let data={value:true};
      if(typeof(data_1)==='string'){
        data_1=data_1.toLowerCase().replaceAll("'",'"');
        //console.log('******data_1*****:',data_1,'...comparativo:.',data_1[0]!=='"');
        data=JSON.parse(data_1);
      }
      else 
        data=data_1;
      //console.log('IoT-indicator: Datos recibidos:',data,'...data.value ===true:',data.value ===true);
      console.log("IoT-indicator: data.value recibidos:",data.value);
      if(data.value ===true)// || (typeof(data)=='string' &&( data.value === "true")))
        this.value=true;
      else
        this.value=false;
    }catch(error){
      console.error('Error:',error);
    }
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.topic_ini=this.config.userId+"/"+this.config.selectedDevice.dId+"/"+this.config.variable+"/sdata";
    this._eventBusService.on(this.topic_ini).subscribe(data=>{
      this.processReceiveData(data);
      //console.log('topic:',this.topic_ini);
    })
    console.log('NGONINIT->topic:',this.topic_ini);
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(changes["config"]){
      setTimeout(()=>{
        this.value=false;
        this._eventBusService.off(this.topic_ini);
        this.topic_ini==this.config.userId+"/"+this.config.selectedDevice.dId+"/"+this.config.variable+"/sdata";
        this._eventBusService.on(this.topic_ini).subscribe(data=>{
          this.processReceiveData(data);
        });

      },300);
    }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this._eventBusService.off(this.topic_ini);
  }

}

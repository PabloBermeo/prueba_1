import { Component, Input } from '@angular/core';
import { EventBusService } from 'src/app/services/event-bus.service';

@Component({
  selector: 'app-iotbutton',
  templateUrl: './iotbutton.component.html',
  styles: [
  ]
})
export class IotbuttonComponent {
  @Input() config:any;
  value=true;
  sending=false;
  constructor(private _eventBus:EventBusService){}
  getIconColor():string{
    return this._eventBus.getIconColor(this.sending || !this.value,this.config);
  }

  sendValue(){
      /*this.sending=true;
      setTimeout(()=>{
        this.sending=false;
      },1500);*/
      const toSend={
        topic:this.config.userId+"/"+this.config.selectedDevice.dId+"/"+this.config.variable+"/acdata",
        msg:{
          value: this.config.message
        }
      }
      this._eventBus.emit('mqtt-sender',toSend);
  }
}

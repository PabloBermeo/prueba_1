import { Component, Input } from '@angular/core';
import { EventBusService } from 'src/app/services/event-bus.service';

@Component({
  selector: 'app-iotswitch',
  templateUrl: './iotswitch.component.html',
  styles: [
  ]
})
export class IotswitchComponent {
  @Input() config:any;
  value=false;
  sending=false;
  constructor(private _eventBus:EventBusService){}
  getIconColor(){
    return this._eventBus.getIconColor( this.sending|| !this.value,this.config);
  }

  sendValue(){
    this.sending=true;
    this.value=!this.value;
    this.config.message=`${this.value}`;
    const toSend={
      topic: this.config.userId+"/"+this.config.selectedDevice.dId+"/"+this.config.variable+"/acdata",
      msg:{ value:this.config.message}
    }
    this._eventBus.emit('mqtt-sender',toSend);
    this.sending=false;
  }
}

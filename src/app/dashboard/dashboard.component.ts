import { Component, OnInit } from '@angular/core';
import { IConfigW, IDevice } from '../services/clases.models';
import { PeticionesHttpService } from '../services/peticiones-http.service';
//import * as Chartist from 'chartist';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  selectedDeviceIndex:number=-1;
  devices:IDevice[]=[];
  constructor(private _peticionesHttp:PeticionesHttpService){

  }
 ngOnInit(): void {
   this._peticionesHttp.getDeviceSelected().subscribe(valor=>{
    this.selectedDeviceIndex=valor;
    this._peticionesHttp.devicesAsObservable().subscribe(devices=>{
      this.devices=devices;
    })
   })
 }

 widgets():IConfigW[]{
  if(this.devices[this.selectedDeviceIndex].template?.widgets?.length !== undefined){
    return this.devices[this.selectedDeviceIndex].template?.widgets!;
  }else{
    return [];
  }
 }
}

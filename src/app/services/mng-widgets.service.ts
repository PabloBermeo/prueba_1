import { Injectable } from '@angular/core';
import { IConfigW } from './clases.models';



@Injectable({
  providedIn: 'root'
})
export class MngWidgetsService {
  templates=[];
  widgets:IConfigW[]=[];
  widgetType=['numberChart','indicator','map','switch','button'];
  readTypeWidgets(type:number){
    if(type<this.widgetType.length){
      return this.widgetType[type];
    }
    return '';
  }
  readWidgets():IConfigW[]{
    return this.widgets;
  }
  addNewWidget(newWidget:IConfigW){
    this.widgets.push(JSON.parse(JSON.stringify(newWidget)));
  }
  delWidget(pos:number){
    if(pos<this.widgets.length){
      this.widgets.splice(pos,1);
    }
  }
  constructor() { }
  makeId(length:number){
    var result='';
    var caracteres='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.';
    var caracteres_n=caracteres.length;
    for(var i=0;i<length;i++){
      result+=caracteres.charAt( Math.floor(Math.random()*caracteres_n));
    }
    return result;
  }
}



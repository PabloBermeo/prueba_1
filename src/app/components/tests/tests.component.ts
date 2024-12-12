import { Component } from '@angular/core';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styles: [
  ]
})
export class TestsComponent {
  configButton={
    userId:'id-user',
    text:'Hola Mundo',
    message:"{'value':'true'}",
    selectedDevice:{
      name:"Home",
      dId:"5551",
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
    class:'primary',
    decimalPlaces:2,
    unit:'ºC'

  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DevicesComponent } from './devices/devices.component';
import { AlarmsComponent } from './alarms/alarms.component';
import { TemplatesComponent } from './templates/templates.component';
import { TestsComponent } from './tests/tests.component';
import { IotindicatorComponent } from './iotindicator/iotindicator.component';
import { IotbuttonComponent } from './iotbutton/iotbutton.component';
import { IotswitchComponent } from './iotswitch/iotswitch.component';
import { NumberchartComponent } from './numberchart/numberchart.component';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { FormulariosModule } from '../forms/formularios.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgChartsModule,
    NgbModule,
    FormsModule,
    FormulariosModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    DevicesComponent,
    AlarmsComponent,
    TemplatesComponent,
    TestsComponent,
    IotindicatorComponent,
    IotbuttonComponent,
    IotswitchComponent,
    NumberchartComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    IotindicatorComponent,
    IotbuttonComponent,
    IotswitchComponent,
    NumberchartComponent
  ]
})
export class ComponentsModule { }

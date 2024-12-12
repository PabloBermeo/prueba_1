import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { MqttModule, MqttService } from 'ngx-mqtt';
import { MQTT_SERVICE_OPTIONS } from 'src/environments/environment';
//import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    NgbModule,
//    SweetAlert2Module,
    ToastrModule.forRoot(),
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS)
  ],

  declarations: [
    AppComponent,
    AdminLayoutComponent

  ],
  providers: [
    MqttService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

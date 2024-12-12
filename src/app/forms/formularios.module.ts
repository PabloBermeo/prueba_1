import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FnumberchartComponent } from './fnumberchart/fnumberchart.component';
import { FindicatorComponent } from './findicator/findicator.component';
import { FmapComponent } from './fmap/fmap.component';
import { FswitchComponent } from './fswitch/fswitch.component';
import { FbuttonComponent } from './fbutton/fbutton.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';



@NgModule({
  declarations: [
    FnumberchartComponent,
    FindicatorComponent,
    FmapComponent,
    FswitchComponent,
    FbuttonComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[
    FnumberchartComponent,
    FindicatorComponent,
    FmapComponent,
    FswitchComponent,
    FbuttonComponent,
    LoginComponent,
    RegisterComponent
  ]
})
export class FormulariosModule { }

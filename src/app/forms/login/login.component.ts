import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PeticionesHttpService } from 'src/app/services/peticiones-http.service';
import { UiServiceService } from 'src/app/services/ui-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user={email:'',password:''};
  constructor(private _peticionesHttp:PeticionesHttpService,
              private router:Router,
              private uiServices:UiServiceService,
  ){
    
  }
  login(){
    console.log('Usuario:',this.user);
    this._peticionesHttp.login(this.user.email,this.user.password)
                          .then(val=>{
                            console.log('login respuesta:',val);
                            if(val){
                              //this.uiServices.alertaInformativa('Bienvenido a IoT-P64');
                              
                              this.router.navigateByUrl('/dashboard');
                            }else{
                              console.error('login incorrecto error user/password');
                            }
                          }).catch(err=>{
                            console.log('ERROR en login:',err);
                            this.uiServices.alertaError('Error en Login no definido');
                          })
  }

}

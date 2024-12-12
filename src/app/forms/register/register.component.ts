import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PeticionesHttpService } from 'src/app/services/peticiones-http.service';
import { UiServiceService } from 'src/app/services/ui-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  `  .login-container {
    max-width: 400px;
    height:650px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }`
  ]
})
export class RegisterComponent {
  user={
    name:'',
    email:'',
    password:''
  }
  constructor(private _peticionesHttp:PeticionesHttpService,
              private router:Router,
              private _uiServices:UiServiceService
  ){}
  register(){
    //console.log('Register user:',this.user);
    this._peticionesHttp.register(this.user).then(val=>{
      if(val){
        this.router.navigateByUrl('/dashboard');
      }
    }).catch(err=>{
      if(err.error.err.errors.message)
        this._uiServices.alertaError('ERROR en creación de Usuario'+err.error.err.errors.message);
      else
        this._uiServices.alertaError('Error en creación de usuario no definido');
    })
  }
}

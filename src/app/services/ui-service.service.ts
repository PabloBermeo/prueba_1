import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UiServiceService {

  constructor(private toatsr: ToastrService) { }

  toastSuccess(mensaje:string){
    this.toatsr.success(mensaje,'Ok:',{positionClass:"toast-top-center"});
  }
  toastInformativo(mensaje:string){
    this.toatsr.info(mensaje,'Info:',{positionClass:"toast-top-center"});
  }
  toastWarning(mensaje:string){
    this.toatsr.warning(mensaje,'Ok:',{positionClass:"toast-top-center"});
  }
  async alertaInformativa(msn:string){
    //console.log('Informativo:',msn);
    await Swal.fire({
      icon:'info',
      title:'Information',
      text:msn
    })
  }
  async alertaError(msn:string){
    console.error('Error:',msn);
    await Swal.fire({
      icon:'error',
      //title:'ERROR!!!...',
      text:msn
    });
  }
}

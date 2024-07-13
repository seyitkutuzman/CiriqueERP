import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }

  callToast(example:string, text:string,timer:number,button:boolean,icon:SweetAlertIcon = "success", position:SweetAlertPosition = "bottom-right"){
    swal.fire({
      title:example,
      text:text,
      timer:timer,
      showConfirmButton:button,
      toast:true,
      position: "bottom-right",
      icon: icon
    });
  }

  callSwal(callBack:()=> void,example:string, text:string,timer:number,button:boolean = true,cancelButton:boolean = true,confirmText:string,cancelText:string,icon:SweetAlertIcon = "success", position:SweetAlertPosition = "bottom-right"){
    swal.fire({
      title:example,
      text:text,
      timer:timer,
      showConfirmButton:button,
      showCancelButton:cancelButton,
      confirmButtonText:confirmText,
      cancelButtonText:cancelText,
      toast:true,
      position: "bottom-right",
      icon: icon
    }).then(res =>{
      if(res.isConfirmed){
        callBack();
      }
    })
  }
}

export type SweetAlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question'

export type SweetAlertPosition =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'top-left'
    | 'top-right'
    | 'center'
    | 'center-start'
    | 'center-end'
    | 'center-left'
    | 'center-right'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'bottom-left'
    | 'bottom-right'

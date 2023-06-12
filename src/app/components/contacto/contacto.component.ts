import { Component, OnInit } from '@angular/core';
import { GuestService } from 'src/app/services/guest.service';
declare var iziToast:any;

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
  public contacto:any = {};
  public load_btn:Boolean = false;
  constructor(private _guestService:GuestService){
   
  }
  ngOnInit(): void {
    
  }

  registro(registroForm:any){
    if(registroForm.valid){
      this._guestService.enviar_mensaje_contacto(this.contacto).subscribe(
        response => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'se envio correctamente el mensaje.'
          });
          this.contacto = {};
        }
      )
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: "#FF0000",
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son validos'
      });
    }
  }
}

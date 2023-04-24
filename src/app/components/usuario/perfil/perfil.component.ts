import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
declare var iziToast:any;
declare var $:any;
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  public cliente:any = {
    password: ''
  };
  public id:any;
  public token:any;
  constructor(private _clienteService:ClienteService){
    this.id = localStorage.getItem('_id');
    this.token = localStorage.getItem('token');
    if(this.id){
      this._clienteService.obtener_cliente_guest(this.id, this.token).subscribe(
        response => {
          this.cliente = response.data
          console.log(response.data);
        }
      )
    }
  }
  ngOnInit(): void {
    
  }

  actualizar(actualizarForm:any){
    if(actualizarForm.valid){
      this._clienteService.actualizar_perfil_cliente_guest(this.id, this.cliente,this.token).subscribe(
        response => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'se actualizo su perfil correctamente.'
          });
        },
        error => {
          console.log(error);
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

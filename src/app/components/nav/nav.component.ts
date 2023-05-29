import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClienteService } from 'src/app/services/cliente.service';
import { io } from 'socket.io-client';
declare var $:any;
declare var iziToast:any;
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public token:any;
  public id:any;
  public user: any = undefined; 
  public carrito_arr : Array<any> = [];
  public user_lc:any;
  public config_global:any = {};
  public url: any;
  public op_cart = false;
  public subtotal:number = 0;
  public socket = io('http://localhost:4201');
  constructor(private _clienteService:ClienteService, private _router:Router)
  {
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');
    this._clienteService.obtener_config_publico().subscribe(
      response => {
        this.config_global = response.data
      }
      
    )
    if(this.token){
      this._clienteService.obtener_cliente_guest(this.id, this.token).subscribe(
        response => {
          this.user = response.data
          localStorage.setItem('user_data', JSON.stringify(this.user));
          if(localStorage.getItem('user_data')){
            const user_data:any = localStorage.getItem('user_data')
            this.user_lc =  JSON.parse(user_data);
            console.log(this.user_lc)
            this.obtener_carrito_cliente();
            
          }else{
            this.user_lc = undefined;
            
          }
        },
        error => {
          console.log(error);
          this.user = undefined;
          
        }
      )
    }
  }
  obtener_carrito_cliente(){
    this._clienteService.obtener_carrito_cliente(this.user_lc._id, this.token).subscribe(
      response => {
        this.carrito_arr = response.data;
        this.calcular_carrito();
      }
    );
  }
  ngOnInit(): void {
    this.socket.on('new-carrito', (data:any) => {
      console.log(data);
      this.obtener_carrito_cliente();
    });
    this.socket.on('new-carrito-add',(data:any) => {
      console.log(data);
      this.obtener_carrito_cliente();
    });
  }

  logout(){
    window.location.reload();
    localStorage.clear();
    this._router.navigate(['/']);
  }

  op_modalcart(){
    if(!this.op_cart){
      this.op_cart = true;
      $('#cart').addClass('show');
    }else{
      this.op_cart = false;
      $('#cart').removeClass('show');
    }
  }

  calcular_carrito(){
    this.carrito_arr.forEach(element => {
      this.subtotal = this.subtotal + parseInt(element.producto.precio);
    })
  }
  eliminar_item(id:any){
    this._clienteService.eliminar_carrito_cliente(id,this.token).subscribe(
      response => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se elimino correctamente el producto del carrito correctamente'
        });
        this.socket.emit('delete-carrito',{data:response.data});

      }
    )
  }
}





import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClienteService } from 'src/app/services/cliente.service';
import { io } from 'socket.io-client';
import { GuestService } from 'src/app/services/guest.service';
import { Router } from '@angular/router';
declare var iziToast:any;
declare var Cleave:any;
declare var StickySidebar:any;
declare var paypal:any;

interface HtmlInputEvent extends Event{
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  @ViewChild('paypalButton',{static:true}) paypalElement : ElementRef | undefined;
  public idcliente:any;
  public token:any;
  public carrito_arr: Array<any> = [];
  public url:any;
  public subtotal:number = 0;
  public socket = io('http://localhost:4201');
  public total_pagar:any = 0;
  public direccion_principal: any = {};
  public envios: Array<any> = [];
  public precio_envio:any = "0";
  public venta: any = {};
  public dventa: Array<any> = [];
  public card_data : any = {};
  public btn_load:Boolean = false;
  public carrito_load:Boolean = true;
  public user:any = {};
  public error_cupon:any = '';
  public descuento_fijo:any = 0;
  constructor( private _clienteService:ClienteService, private _guestService:GuestService, private _router:Router){
    this.idcliente = localStorage.getItem('_id');
    this.venta.cliente = this.idcliente;
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    
    
    
    this._guestService.get_Envios().subscribe(
      response => {
        this.envios = response;
        console.log(this.envios);
      }
    );
    const user_data:any = localStorage.getItem('user_data');

    this.user = JSON.parse(user_data);

  }
  ngOnInit(): void {
    this.init_Data();
    setTimeout(() => {
      new Cleave('#cc-number', {
        creditCard: true,
        onCreditCardTypeChanged: function(type:any){

        }
      });
      new Cleave('#cc-number',{
        date: true,
        datePattern: ['m','y']
      });
      new StickySidebar('.sidebar-sticky', {topSpacing: 20});
    });
    this.get_direccion_principal();
    paypal.Buttons({
      style: {
          layout: 'horizontal'
      },
      createOrder: (data:any,actions:any)=>{
  
          return actions.order.create({
            purchase_units : [{
              description : 'Pago en mi tienda',
              amount : {
                currency_code : 'USD',
                value: this.subtotal
              },
            }]
          });
        
      },
      onApprove : async (data:any,actions:any)=>{
        const order = await actions.order.capture();
        this.venta.transaccion = order.purchase_units[0].payments.captures[0].id;
        this.venta.detalles = this.dventa;
        this._clienteService.registro_compra_cliente(this.venta,this.token).subscribe(
          response => {
            this._clienteService.enviar_correo_compra_cliente(response.venta._id,this.token).subscribe(
              response => {
                this._router.navigate(['/']);
              }
            );
          }
        );

        
      },
      onError : (err:any) =>{
       
      },
      onCancel: function (data:any, actions:any) {
        
      }
    }).render(this.paypalElement?.nativeElement);
  }

  init_Data(){
    this._clienteService.obtener_carrito_cliente(this.idcliente, this.token).subscribe(
      response => {
        this.carrito_arr = response.data;
        this.carrito_arr.forEach(element => {
          this.dventa.push({
            producto: element.producto._id,
            subtotal: element.producto.precio,
            variedad: element.variedad,
            cantidad: element.cantidad,
            cliente: localStorage.getItem('_id')
          })
        });
        this.carrito_load = false;
        this.calcular_carrito();
        this.calcular_total('Envio Gratis');
      }
    );
  }
  get_direccion_principal(){
    this._clienteService.obtener_direccion_principal_cliente(localStorage.getItem('_id'),this.token).subscribe(
      response => {
        if(response.data == undefined){
          this.direccion_principal = undefined;
          console.log(this.direccion_principal);
        }else{
          this.direccion_principal = response.data;
          this.venta.direccion = this.direccion_principal._id;
          console.log(this.direccion_principal);
        }
        
        
      }
    )
  }
  calcular_carrito(){
    this.subtotal = 0;
    this.carrito_arr.forEach(element => {
      this.subtotal = this.subtotal + parseInt(element.producto.precio);
    });
    this.total_pagar = this.subtotal;
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
          message: 'Se elimino el producto del carrito correctmante'
        });
        this.socket.emit('delete-carrito',{data:response.data});
        this.init_Data();
      }
    )
  }
  calcular_total(envio_titulo:any){
    this.total_pagar = parseInt(this.subtotal.toString()) + parseInt(this.precio_envio);
    this.venta.subtotal = this.total_pagar;
    this.venta.envio_precio = parseInt(this.precio_envio);
    this.venta.envio_titulo = envio_titulo;

  }

  validar_cupon(){
    if(this.venta.cupon){
      if(this.venta.cupon.toString().length <= 25){
        this.error_cupon = '';
        this._clienteService.validar_cupon_admin(this.venta.cupon,this.token).subscribe(
          response => {
            if(response.data != undefined)
            {
              this.error_cupon = '';
              if(response.data.tipo == 'Valor fijo'){
                this.descuento_fijo = response.data.valor;
                this.total_pagar = this.total_pagar - this.descuento_fijo;
              }else if(response.data.tipo == 'Porcentaje')
              {
                this.descuento_fijo = (this.total_pagar * response.data.valor)/100;
                this.total_pagar = this.total_pagar - this.descuento_fijo;
              }
            }else{
              this.error_cupon = 'El cupon no se pudo canjear';
            }
          }
        )
      }else{
        this.error_cupon = 'El cupon debe ser menos de 30 caracteres';
      }
    }
    
  }
}

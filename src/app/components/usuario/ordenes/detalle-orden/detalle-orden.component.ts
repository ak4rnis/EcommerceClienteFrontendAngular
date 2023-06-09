import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StarRatingComponent } from 'ng-starrating';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClienteService } from 'src/app/services/cliente.service';
declare var iziToast:any;
declare var $:any;
@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrls: ['./detalle-orden.component.css']
})
export class DetalleOrdenComponent implements OnInit {
  public url:any;
  public token:any;
  public orden:any = {};
  public detalles: Array<any> = [];
  public load_data:Boolean = true;
  public id:any;
  public totalstar:number = 5;
  public review: any = {}
  constructor(private _clienteServcie:ClienteService, private _route:ActivatedRoute){
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._route.params.subscribe(
      params => {
        this.id = params['id'];
        this.init_data();
      }
    )

  }
  ngOnInit(): void {
    
  }
  init_data(){
    this._clienteServcie.obtener_detalles_ordenes_cliente(this.id,this.token).subscribe(
      response => {
        if(response.data != undefined){
          this.orden = response.data;
          response.detalles.forEach((element:any) => {
            this._clienteServcie.obtener_review_producto_cliente(element.producto._id).subscribe(
              response => {
                
                let emitido = false;
                response.data.forEach((element_:any) => {
                  if(element_.cliente == localStorage.getItem('_id')){
                    emitido = true;
                  }
                });
                element.estado = emitido;
              }
            )
          })
          this.detalles = response.detalles;
          this.load_data = false;
          

        }else{
          this.orden = undefined;
        }
        
      }
    )
  }

  onModal(item:any){
    this.review = {};
    this.review.producto = item.producto._id;
    this.review.cliente = item.cliente,
    this.review.venta = this.id;
  }

  onRate($event:{oldValue:number, newValue:number, starRating:StarRatingComponent}){

  }

  emitir(id:any){
    if(this.review.review){
      if(this.totalstar && this.totalstar >= 0){
        this.review.estrellas = this.totalstar;
        this._clienteServcie.emitir_review_producto_cliente(this.review,this.token).subscribe(
          response => {
            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRignt',
              message: 'Se emitio correctamente la reseña.'
            });
            $('#review-'+id).modal('hide');
            $('.modal-backdrop').removeClass('show');
            this.init_data();
          }
        )
      }else{
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRignt',
          message: 'Selecione un numero de estrellas'
        });
      }
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRignt',
        message: 'Ingrese un mensaje de la reseña'
      });
    }
  }


}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StarRatingComponent } from 'ng-starrating';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClienteService } from 'src/app/services/cliente.service';

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
        this._clienteServcie.obtener_detalles_ordenes_cliente(this.id,this.token).subscribe(
          response => {
            if(response.data != undefined){
              this.orden = response.data;
              this.detalles = response.detalles;
              console.log(this.orden);
              console.log(this.detalles);
            }else{
              this.orden = undefined;

            }
            
          }
        )
      }
    )

  }
  ngOnInit(): void {
    
  }

  onRate($event:{oldValue:number, newValue:number, starRating:StarRatingComponent}){

  }
}

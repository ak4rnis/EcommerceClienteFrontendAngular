import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  public url:any;
  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }
  login_cliente(data:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url+'login_cliente',data,{headers:headers});

  }

  obtener_cliente_guest(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_cliente_guest/'+id,{headers:headers});
  }

  actualizar_perfil_cliente_guest(id:any, data:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'actualizar_perfil_cliente_guest/'+id,data,{headers:headers});
  }

  obtener_config_publico():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'obtener_config_publico',{headers:headers});
  }

  listar_productos_publico(filtro:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'listar_productos_publico/'+filtro,{headers:headers});
  }

  getToken()
  {
    return localStorage.getItem('token');

  }
  public isAuthenticated():boolean{
    const token:any = localStorage.getItem('token');
    if(!token){
      localStorage.clear();
      return false;
    }
    try{
      const helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(token);
      if(helper.isTokenExpired(token)){
        localStorage.clear();
        return false;
      }
      if(!decodedToken)
      {
        localStorage.clear();
        return false;
      }
    }catch(error)
    {
      localStorage.clear();
      return false;
    }
    return true;
  }

  agregar_carrito_cliente(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this._http.post(this.url+'agregar_carrito_cliente',data,{headers:headers});
  }
  obtener_carrito_cliente(id:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization':token});
    return this._http.get(this.url+'obtener_carrito_cliente/'+id,{headers:headers});
  }

  eliminar_carrito_cliente(id:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization':token});
    return this._http.delete(this.url+'eliminar_carrito_cliente/'+id,{headers:headers});
  }

  registro_direccion_cliente(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'registro_direccion_cliente',data,{headers:headers});
  }
  obtener_direccion_todos_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_direccion_todos_cliente/'+id,{headers:headers});
  }

  cambiar_direccion_principal_cliente(id:any, cliente:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this._http.put(this.url+'cambiar_direccion_principal_cliente/'+id+'/'+cliente,{data:true},{headers:headers});
  }

  obtener_direccion_principal_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this._http.get(this.url+'obtener_direccion_principal_cliente/'+id,{headers:headers});
  }

  registro_compra_cliente(data:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this._http.post(this.url+'registro_compra_cliente',data,{headers:headers});
  }

  enviar_correo_compra_cliente(id:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this._http.get(this.url+'enviar_correo_compra_cliente/'+id,{headers:headers});
  }

  validar_cupon_admin(cupon:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this._http.get(this.url+'validar_cupon_admin/'+cupon,{headers:headers});
  }

  obtener_ordenes_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_ordenes_cliente/'+id,{headers:headers});
  }

  obtener_detalles_ordenes_cliente(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_detalles_ordenes_cliente/'+id,{headers:headers});
  }

  
  emitir_review_producto_cliente(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'emitir_review_producto_cliente',data,{headers:headers});
  }
  obtener_review_producto_cliente(id:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'obtener_review_producto_cliente/'+id,{headers:headers});
  }

  obtener_reviews_cliente(id:any, token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization':token});
    return this._http.get(this.url+'obtener_reviews_cliente/'+id,{headers:headers});
  }
  


  
}

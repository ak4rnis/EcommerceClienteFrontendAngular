import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public token:any;
  public id:any;
  public user: any = undefined; 
  public user_lc:any;

  constructor(private _clienteService:ClienteService)
  {
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');
    if(localStorage.getItem('user_data')){
      const user_data:any = localStorage.getItem('user_data')
      this.user_lc =  JSON.parse(user_data);
      console.log(this.user_lc)
      
    }else{
      this.user_lc = undefined;
    }
    
    this._clienteService.obtener_cliente_guest(this.id, this.token).subscribe(
      response => {
        
        this.user = response.data
        localStorage.setItem('user_data', JSON.stringify(this.user));
        
        
        
      },
      error => {
        console.log(error);
        this.user = undefined;
      }
    )

  }
  ngOnInit(): void {
    
  }
}

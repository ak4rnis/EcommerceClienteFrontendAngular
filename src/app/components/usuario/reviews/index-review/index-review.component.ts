import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-index-review',
  templateUrl: './index-review.component.html',
  styleUrls: ['./index-review.component.css']
})
export class IndexReviewComponent implements OnInit {
  public token:any;
  public url:any;
  public reviews: Array<any> = [];
  public load_data:Boolean = true;
  public page:number = 1;
  public pageSize:number = 15;
  constructor(private _router:Router, private _clienteService:ClienteService){
    this.token = localStorage.getItem('token');
  }
  ngOnInit(): void {
    this._clienteService.obtener_reviews_cliente(localStorage.getItem('_id'),this.token).subscribe(
      response => {
        console.log(response);
        this.reviews = response.data;
        this.load_data = false;
      }
    )
  }

  logout(){
    window.location.reload();
    localStorage.clear();
    this._router.navigate(['/']);
    
  }
}

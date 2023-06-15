import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-index-review',
  templateUrl: './index-review.component.html',
  styleUrls: ['./index-review.component.css']
})
export class IndexReviewComponent implements OnInit {
  constructor(private _router:Router){

  }
  ngOnInit(): void {
    
  }

  logout(){
    window.location.reload();
    localStorage.clear();
    this._router.navigate(['/']);
    
  }
}

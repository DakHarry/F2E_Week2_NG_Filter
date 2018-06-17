import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-spot',
  templateUrl: './spot.component.html',
  styleUrls: ['./spot.component.css']
})
export class SpotComponent implements OnInit {
  id: number;
  private sub: any;
  spot: any;
  constructor(private route: ActivatedRoute,private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      console.log('p',params);
      document.getElementById('spot-search-wrapper').remove();
      this.id = +params['id']; // (+) converts string 'id' to a number       
      this.http.get('https://f2e-filter.firebaseio.com/result.json')
      .subscribe((value: any) => {
        this.spot = value.records.find((record) => {
          return  record._id == this.id;
        })
        console.log(this.spot);
      });  
   });
  }
  onClick(){
    this.router.navigate(['/']);

  }

}

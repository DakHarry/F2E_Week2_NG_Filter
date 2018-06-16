import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgModel } from '@angular/forms';

import { combineLatest } from 'rxjs';
import {debounceTime} from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  data: any;
  keyword = '';
  zone = '';
  price = '';
  selectList = [];
  ticketInfo = [];
  totalCount = 0;
  @ViewChild('tKeyword') tKeyword: NgModel;
  @ViewChild('tZone') tZone: NgModel;
  @ViewChild('tPrice') tPrice: NgModel;
  constructor(private http: HttpClient) {
  }
  ngOnInit(): void{
    this.http.get('https://f2e-filter.firebaseio.com/result.json')
      .subscribe((value: any) => {
        this.data = value.records.slice(0,10);
        value.records.forEach(record => {
          if(!this.selectList.includes(record.Zone))
            this.selectList.push(record.Zone);
          if(!this.ticketInfo.includes(record.Ticketinfo))
            this.ticketInfo.push(record.Ticketinfo);
        });
      })
      console.log(this.ticketInfo);
  }

  ngAfterViewInit(){
    combineLatest(
      this.tKeyword.valueChanges,
      this.tZone.valueChanges,
      this.tPrice.valueChanges
    )
    .pipe(
      debounceTime(800)
    )
    .subscribe((latestValues) => {
      var [keyword,zone,price] = latestValues;
      this.http.get('https://f2e-filter.firebaseio.com/result.json')
      .subscribe((value: any) => {
        this.data = value.records.filter(col => {
          // console.log(col.Name);
          return col.Name.indexOf(keyword) > -1 && col.Zone.indexOf(zone) > -1 && col.Ticketinfo.indexOf(price) > -1 ;
        });
        this.totalCount = this.data.length;
        this.data = this.data.slice(0,10);
      })
    })
  }
}

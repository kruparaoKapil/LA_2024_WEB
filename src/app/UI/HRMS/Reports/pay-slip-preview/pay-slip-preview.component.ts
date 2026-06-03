import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pay-slip-preview',
  templateUrl: './pay-slip-preview.component.html',
  styles: []
})
export class PaySlipPreviewComponent implements OnInit {

  constructor(private activatedroute:ActivatedRoute) { }

  ngOnInit() {
   debugger
    let routeParams = atob(this.activatedroute.snapshot.queryParamMap.get('id'));

    console.log("routeParams", routeParams);

    let splitData = routeParams.split("@");
  }

}

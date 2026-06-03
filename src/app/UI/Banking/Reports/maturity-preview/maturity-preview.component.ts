import { Component, OnInit, } from '@angular/core';

@Component({
  selector: 'app-maturity-preview',
  templateUrl: './maturity-preview.component.html',
  styles: []
})
export class MaturityPreviewComponent implements OnInit {
  printFileName : any = 'MaturityDetails'
  originalCertificate: any;
  paCard: string;


  constructor() { }
  ngOnInit() { }

  clickOriginalCertificate(event) {
    debugger;
    if (event.target.checked == true) {
      this.originalCertificate = 'YES';
    }

    else{
      this.originalCertificate = ''
    }
  }

  panCard(event) {
    debugger;
    if (event.target.checked == true) {
      this.paCard = 'HAJPK1457F';
    }

    else{
      this.paCard = ''
    }
  }



  print() {
    let printContents, popupWin;
    printContents = document.getElementById('temp-box').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Maturity Details</title>
          <link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
           <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.common.min.css" />
           <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.default.min.css" />
           <link rel="stylesheet" href="http://kendo.cdn.telerik.com/2019.3.917/styles/kendo.default.mobile.min.css" />
         <link rel="stylesheet" type="text/css" href="assets/css/custom.css" />
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }


}

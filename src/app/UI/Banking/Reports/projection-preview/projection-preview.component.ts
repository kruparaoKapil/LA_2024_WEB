import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/Services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-projection-preview',
  templateUrl: './projection-preview.component.html',
  styles: []
})

 

export class ProjectionPreviewComponent implements OnInit {
 tableData: any[] = [];
  previewData: any[]=[];
  constructor() { }
 

  ngOnInit() {
  const data = sessionStorage.getItem('previewData');
  this.previewData = data ? JSON.parse(data) : [];
  console.log("Preview Data:", this.previewData);
}

}

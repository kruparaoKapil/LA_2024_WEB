import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-validation-message',
  templateUrl: './validation-message.component.html',
  styles: []
})
export class ValidationMessageComponent implements OnInit {
  @Input() messgae: any;
  constructor() { }

  ngOnInit() {
  }

}

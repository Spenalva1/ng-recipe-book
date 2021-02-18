import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  protected showAlert = false;
  protected t: string;
  protected h: string;
  protected b : string;
  protected f: string;

  constructor() { }

  ngOnInit(): void {
  }

  public create(type: 'success' | 'warning' | 'danger', header: string, body: string, footer: string) {
    this.t = type;
    this.h = header;
    this.b = body;
    this.f = footer;
  }

  public show() {
    this.showAlert = true;
  }

  public dismiss($event) {
    if ($event.target.className === 'layer') {
      this.showAlert = false;
    }
  }

}

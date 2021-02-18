import { Component, ViewChild } from '@angular/core';
import { AlertComponent } from './components/alert/alert.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('alert') alert: AlertComponent;

  showDangerAlert() {
    this.alert.create('danger', 'Encabezadoooooooo', 'cuerpoooooooooooooo', 'foteeeeeeeeer');
    this.alert.show();
  }

  showSuccessAlert() {
    this.alert.create('success', 'Encabezadoooooooo', 'cuerpoooooooooooooo', 'foteeeeeeeeer');
    this.alert.show();
  }

  showWarningAlert() {
    this.alert.create('warning', 'Encabezadoooooooo', 'cuerpoooooooooooooo', 'foteeeeeeeeer');
    this.alert.show();
  }
}

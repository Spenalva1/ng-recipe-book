import { Component } from '@angular/core';
import { Event } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  evenNumbers = [];
  oddNumbers = [];

  onTimerIncreased(time: number) {
    if (time % 2 === 0) {
      this.evenNumbers.push(time);
    } else {
      this.oddNumbers.push(time);
    }
  }

}

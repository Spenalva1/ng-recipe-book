import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  showParagraph = true;
  logs= [];

  toggleParagraph() {
    this.showParagraph = !this.showParagraph;
    this.logs.push(new Date().getTime());
  }

}

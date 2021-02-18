import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-game-control',
  templateUrl: './game-control.component.html',
  styleUrls: ['./game-control.component.css']
})
export class GameControlComponent implements OnInit {
  @Output() timerIncreased = new EventEmitter<number>();

  ref: any;
  time = 0;

  constructor() { }

  ngOnInit(): void {
  }

  onStart() {
    this.ref = setInterval(() => {
      this.time++;
      this.timerIncreased.emit(this.time);
    }, 1000);
  }

  onStop() {
    clearInterval(this.ref);
  }
}

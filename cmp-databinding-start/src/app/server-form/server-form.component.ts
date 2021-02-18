import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-server-form',
  templateUrl: './server-form.component.html',
  styleUrls: ['./server-form.component.css']
})
export class ServerFormComponent {
  @Output() elementAdded = new EventEmitter();
  newServerName = '';
  newServerContent = '';

  onAddElement(type: string) {
    this.elementAdded.emit({
      type,
      name: this.newServerName,
      content: this.newServerContent
    });
  }

}

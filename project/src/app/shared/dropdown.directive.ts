import { Directive, ElementRef, HostBinding, HostListener, OnInit, Renderer2 } from '@angular/core';
import { Event } from '@angular/router';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class') elementClass = '';

  constructor(private elRef: ElementRef, private renderer: Renderer2) { }

  @HostListener('click') click(eventData: Event) {
    this.elementClass = this.elementClass === '' ? 'open' : '';
  }

}

import { Component, OnInit } from '@angular/core';

declare const $: any;

@Component({
  selector: 'sw-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    $('.context .ui.sidebar')
      .sidebar({
        context: $('.context .bottom.segment')
      })
      .sidebar('attach events', '.context .menu .active.item');
  }
}

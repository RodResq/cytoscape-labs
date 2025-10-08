import { Component } from '@angular/core';
import { Popover } from 'primeng/popover';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [Popover, InputTextModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css',
})
export class InfoComponent {

}

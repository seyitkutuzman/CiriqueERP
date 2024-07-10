import { Component } from '@angular/core';
import { LoginComponent } from '../../login/login.component';

@Component({
  selector: 'app-main-sidebar',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './main-sidebar.component.html',
  styleUrl: './main-sidebar.component.css'
})
export class MainSidebarComponent {

}

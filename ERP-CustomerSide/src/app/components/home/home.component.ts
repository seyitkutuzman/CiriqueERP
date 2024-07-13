import { Component } from '@angular/core';
import { BlankComponent } from '../blank/blank.component';
import { SectionComponent } from '../section/section.component';
import { SharedModule } from '../../modules/shared.module';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, LoginComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

}

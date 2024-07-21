import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlankComponent } from '../components/blank/blank.component';
import { SectionComponent } from '../components/section/section.component';
import { FormsModule } from '@angular/forms';
import { MainSidebarComponent } from '../components/layouts/main-sidebar/main-sidebar.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BlankComponent,
    SectionComponent,
    FormsModule,
    MainSidebarComponent,
    RouterModule
  ],
  exports: [
    CommonModule,
    BlankComponent,
    SectionComponent,
    FormsModule,
    MainSidebarComponent,
    RouterModule
  ]
})
export class SharedModule { }

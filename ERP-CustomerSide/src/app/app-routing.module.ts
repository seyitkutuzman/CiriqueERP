import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component'; 
import { LayoutsComponent } from './components/layouts/layouts.component';
import { CocMowComponent } from './components/coc-mow/coc-mow.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: LayoutsComponent, children: [
    {
        path: '',
        component: HomeComponent
    }] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
  {path: 'coc-mow', component: CocMowComponent}
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

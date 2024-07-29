import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component'; 
import { LayoutsComponent } from './components/layouts/layouts.component';
import { CocMowComponent } from './components/coc-mow/coc-mow.component';
import { RegulatoryInformationComponent } from './components/regulatory/regulatory.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LayoutsComponent, children: [
    { path: '', component: HomeComponent },
    { path: 'coc-mow', component: CocMowComponent },
    {path: 'regulatory', component: RegulatoryInformationComponent}
  ] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

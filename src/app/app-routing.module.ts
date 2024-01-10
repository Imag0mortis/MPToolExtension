import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WrapperComponent } from './wrapper/wrapper.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { LoginComponent } from './shared/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/card', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./shared/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'card',
    loadChildren: () => import('./card/card.module').then((m) => m.CardModule),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

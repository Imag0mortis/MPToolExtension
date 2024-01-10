import { Routes, RouterModule } from '@angular/router';
import { CardComponent } from './card.component';

const routes: Routes = [
  {
    path: '',
    component: CardComponent
  }
];

export const CardRoutes = RouterModule.forChild(routes);
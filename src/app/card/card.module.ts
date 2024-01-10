import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardRoutes } from './card.routing';
import {TuiIslandModule} from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';
import { Routes } from '@angular/router';
import { CardComponent } from './card.component';

const routes: Routes = [
  {
    path: '',
    component: CardComponent
  }
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CardRoutes,
    TuiIslandModule,
    TuiButtonModule,
    FormsModule
  ]
})
export class CardModule { }

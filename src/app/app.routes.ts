import { Routes } from '@angular/router';
import { LoadingComponent } from './components/loading/loading.component';
import { HomeComponent } from './components/home/home.component';
import { BoardComponent } from './components/board/board.component';

export const routes: Routes = [
  { path: '', redirectTo: 'loading', pathMatch: "full"},
  { path: 'loading', component: LoadingComponent},
  { path: 'home', component: HomeComponent },
  { path: 'board', component: BoardComponent},
  { path: '**', redirectTo: '' }
];

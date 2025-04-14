import { Routes } from '@angular/router';
import { CvPuzzleComponent } from './cv-puzzle/cv-puzzle.component';
import { ProjetsComponent } from './pages/projets/projets.component';
import { MainPageComponent } from './main-page/main-page.component';


export const routes: Routes = [
  {
    path: 'cv/:id',
    component: CvPuzzleComponent,
  },

    {
      path: '',
      component: MainPageComponent,
      pathMatch: 'full',
    },
  { path: 'projets/:id', component: ProjetsComponent },

];

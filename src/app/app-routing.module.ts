import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobAdFormComponent } from './job-ad-form/job-ad-form.component';
import { JobAdListComponent } from './job-ad-list/job-ad-list.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'ad-list', component: JobAdListComponent },
  { path: 'ad-form/create', component: JobAdFormComponent },
  { path: 'ad-form/:id', component: JobAdFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

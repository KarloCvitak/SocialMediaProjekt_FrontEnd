import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostCreateComponent } from './post-create/post-create.component';
import {AuthenticationGuard} from "./auth/auth.guard";
import {AuthModule} from "./auth/auth.module";
import {NavBarComponent} from "./nav-bar/nav-bar.component";

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthenticationGuard] },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthenticationGuard] },
  { path: 'post/:id', component: PostDetailComponent, canActivate: [AuthenticationGuard] },
  { path: 'create-post', component: PostCreateComponent, canActivate: [AuthenticationGuard] }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

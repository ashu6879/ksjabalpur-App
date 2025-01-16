import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SplashPage } from './splash/splash.page'; // Import SplashPage
import { WelcomePage } from './welcome/welcome.page'; // Import WelcomePage
import { SignupPage } from './signup/signup.page'; // Import SignupPage

const routes: Routes = [
  { path: '', component: SplashPage }, // Default route to SplashPage
  { path: 'welcome', component: WelcomePage }, // Route to WelcomePage
  { path: 'signup', component: SignupPage }, // Route to SignupPage
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

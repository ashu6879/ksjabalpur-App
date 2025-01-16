import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SplashPage } from './splash/splash.page'; // Import SplashPage
import { WelcomePage } from './welcome/welcome.page'; // Import WelcomePage
import { SignupPage } from './signup/signup.page'; // Import SignupPage
import { SignupVerificationPage } from './signup-verification/signup-verification.page'; // Import SignupPage
import { OtpVerificationPage } from './otp-verification/otp-verification.page'; // Import SignupPage
import { HomePage } from './home/home.page'; // Import SignupPage
const routes: Routes = [
  { path: '', component: SplashPage }, // Default route to SplashPage
  { path: 'welcome', component: WelcomePage }, // Route to WelcomePage
  { path: 'signup', component: SignupPage },
  { path: 'signup-verification', component: SignupVerificationPage },
  { path: 'otp-verification', component: OtpVerificationPage },
  { path: 'home', component: HomePage },


// Route to SignupPage
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

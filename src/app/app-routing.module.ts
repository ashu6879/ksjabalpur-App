import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SplashPage } from './splash/splash.page'; // Import SplashPage
import { WelcomePage } from './welcome/welcome.page'; // Import WelcomePage
import { SignupPage } from './signup/signup.page'; // Import SignupPage
import { SignupVerificationPage } from './signup-verification/signup-verification.page'; // Import SignupPage
import { OtpVerificationPage } from './otp-verification/otp-verification.page'; // Import SignupPage
import { HomePage } from './home/home.page'; // Import SignupPage
import { ProfilePage } from './profile/profile.page'; // Import SignupPage
import { LoginPage } from './login/login.page'; // Import SignupPage
import { CommercialPropertiesPage } from './commercial-properties/commercial-properties.page'; // Import SignupPage
import { HttpClientModule } from '@angular/common/http'; // <-- Import HttpClientModule
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel



const routes: Routes = [
  { path: '', component: SplashPage }, // Default route to SplashPage
  { path: 'welcome', component: WelcomePage }, // Route to WelcomePage
  { path: 'signup', component: SignupPage },
  { path: 'signup-verification', component: SignupVerificationPage },
  { path: 'otp-verification', component: OtpVerificationPage },
  { path: 'home', component: HomePage },
  { path: 'commercial-properties', component: CommercialPropertiesPage },
  { path: 'profile', component: ProfilePage },
  { path: 'login', component: LoginPage }

// Route to SignupPage
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),FormsModule,HttpClientModule
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

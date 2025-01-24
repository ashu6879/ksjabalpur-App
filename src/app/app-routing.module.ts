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
import { PropertyPage } from './property/property.page'; // Import SignupPage
import { AllBuildersPage } from './all-builders/all-builders.page'; // Import SignupPage
import { CommonPropertyPagePage } from './common-property-page/common-property-page.page'; // Import SignupPage
import { HttpClientModule } from '@angular/common/http'; // <-- Import HttpClientModule
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel



const routes: Routes = [
  { path: '', component: SplashPage }, // Default route to SplashPage
  { path: 'welcome', component: WelcomePage }, // Route to WelcomePage
  { path: 'signup', component: SignupPage },
  { path: 'signup-verification', component: SignupVerificationPage },
  { path: 'otp-verification', component: OtpVerificationPage },
  { path: 'home', component: HomePage },
  { path: 'common-property-page', component: CommonPropertyPagePage },
  { path: 'profile', component: ProfilePage },
  { path: 'login', component: LoginPage },
  { path: 'all-builders', component: AllBuildersPage },
  { path: 'property', component: PropertyPage },




// Route to SignupPage
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),FormsModule,HttpClientModule
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

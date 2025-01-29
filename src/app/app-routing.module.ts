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
import { FavouritePropertiesPage } from './favourite-properties/favourite-properties.page'; // Import SignupPage
import { SearchPage } from './search/search.page'; // Import SignupPage
import { CommonPropertyPagePage } from './common-property-page/common-property-page.page'; // Import SignupPage
import { HttpClientModule } from '@angular/common/http'; // <-- Import HttpClientModule
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { AuthGuard } from './auth.guard'; // Import the AuthGuard



const routes: Routes = [
  { path: '', component: SplashPage }, // Default route to SplashPage
  { path: 'welcome', component: WelcomePage }, // Route to WelcomePage
  { path: 'signup', component: SignupPage }, // No AuthGuard needed
  { path: 'signup-verification', component: SignupVerificationPage }, // No AuthGuard needed
  { path: 'otp-verification', component: OtpVerificationPage }, // No AuthGuard needed
  { path: 'home', component: HomePage, canActivate: [AuthGuard] }, // Protected route
  { path: 'common-property-page', component: CommonPropertyPagePage, canActivate: [AuthGuard] }, // Protected route
  { path: 'profile', component: ProfilePage, canActivate: [AuthGuard] }, // Protected route
  { path: 'login', component: LoginPage }, // No AuthGuard needed
  { path: 'all-builders', component: AllBuildersPage, canActivate: [AuthGuard] }, // Protected route
  { path: 'property', component: PropertyPage, canActivate: [AuthGuard] },
  { path: 'favourite-properties', component: FavouritePropertiesPage, canActivate: [AuthGuard] },
  { path: 'search', component: SearchPage, canActivate: [AuthGuard] },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  },

// Protected route
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),FormsModule,HttpClientModule
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

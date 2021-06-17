import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/guards/auth.guard';
import { LoggedGuard } from './services/guards/logged.guard';
import { WelcomeGuard } from './services/guards/welcome.guard';

const routes: Routes = [
  {
    path: '',
    /* loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule) */
    loadChildren: () => import('./pages/start-slide/start-slide.module').then( m => m.StartSlidePageModule),
    canActivate: [ WelcomeGuard ]  
  },
  {
    path: 'bienvenida',
    loadChildren: () => import('./pages/start-slide/start-slide.module').then( m => m.StartSlidePageModule),
    canActivate: [ WelcomeGuard ]  
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate: [ LoggedGuard ]  
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
/*   {
    path: 'user',
    loadChildren: () => import('./pages/user/user.module').then( m => m.UserPageModule)
  }, */
  {
    path: 'encuesta/:config',
    loadChildren: () => import('./pages/poll/poll.module').then( m => m.PollPageModule)
  },
/*   {
    path: 'favoritos',
    loadChildren: () => import('./pages/favorite-poll/favorite-poll.module').then( m => m.FavoritePollPageModule)
  }, */
  {
    path: 'home/billetera/recompensa/:token',
    loadChildren: () => import('./pages/reward/reward.module').then( m => m.RewardPageModule)
  },
  {
    path: 'statistics/:config',
    loadChildren: () => import('./pages/statistics/statistics.module').then( m => m.StatisticsPageModule),
    canActivate: [ AuthGuard ] 
  },
  {
    path: 'informacion/:configId',
    loadChildren: () => import('./pages/summary-statistics/summary-statistics.module').then( m => m.SummaryStatisticsPageModule),
    canActivate: [ AuthGuard ] 
  },
  {
    path: '**', 
    redirectTo: '/'
  },
  

  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
 
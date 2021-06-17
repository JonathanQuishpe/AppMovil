import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthChildrenGuard } from 'src/app/services/guards/auth-children.guard';
import { AuthGuard } from 'src/app/services/guards/auth.guard';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    /* canActivateChild: [AuthChildrenGuard], */
    children: [
      /* {
        path: 'encuestas/:filter',
        canActivate: [ AuthGuard ],
        children: [{
          path: '',
          loadChildren: () => import('./tab-polls/tab-polls.module').then(m => m.TabPollsPageModule)
        },
      ]
      }, */
      {
        path: 'encuestas/filter',
        redirectTo: 'encuestas',
        //pathMatch: 'full'
      },
      {
        path: 'encuestas',
        canActivate: [ AuthGuard ],
        children: [{
          path: '',
          loadChildren: () => import('./tab-polls/tab-polls.module').then(m => m.TabPollsPageModule)
        },
      ]
      },
      {
        path: 'recompensas',
        canActivate: [ AuthGuard ],
        children: [{
          path: '',
          loadChildren: () => import('./tab-rewards/tab-rewards.module').then(m => m.TabRewardsPageModule)
        }]
      },
      {
        path: 'perfil',
        canActivate: [ AuthGuard ],
        children: [{
          path: '',
          loadChildren: () => import('./tab-user/tab-user.module').then( m => m.TabUserPageModule)
        }]
      },
      {
        path: 'billetera',
        canActivate: [ AuthGuard ],
        children: [{
          path: '',
          loadChildren: () => import('./tab-wallet/tab-wallet.module').then(m => m.TabWalletPageModule)
        }]
      },
      {
        path: 'home',
        canActivate: [ AuthGuard ],
        children:[{
          path: '',
          loadChildren: () => import('./tab-home/tab-home.module').then( m => m.TabHomePageModule)
        }]
      },
      {
        path: 'home-establecimiento',
        canActivate: [ AuthGuard ],
        children:[{
          path: '',
          loadChildren: () => import('./tab-home-institution/tab-home-institution.module').then( m => m.TabHomeInstitutionPageModule)
        }]
      },
      {
        path: 'campanas',
        canActivate: [ AuthGuard ],
        children:[{
          path: '',
          loadChildren: () => import('./tab-campaigns/tab-campaigns.module').then( m => m.TabCampaignsPageModule)
        }]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        canActivate: [ AuthGuard ],
        pathMatch: 'full'
      }
    ]
  },
  
  {
    path: '',
    redirectTo: '/tabs/home',
    canActivate: [ AuthGuard ],
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}

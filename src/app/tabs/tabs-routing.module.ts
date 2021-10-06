import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'assets',
        loadChildren: () => import('../pages/assets/assets.module').then(m => m.AssetsPageModule)
      },
      {
        path: 'bids',
        loadChildren: () => import('../pages/bids/bids.module').then(m => m.BidsPageModule)
      },
      {
        path: 'user',
        loadChildren: () => import('../pages/user/user.module').then(m => m.UserPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/assets',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}

import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { DevicesComponent } from 'src/app/components/devices/devices.component';
import { AlarmsComponent } from 'src/app/components/alarms/alarms.component';
import { TemplatesComponent } from 'src/app/components/templates/templates.component';
import { TestsComponent } from 'src/app/components/tests/tests.component';
import { UsuarioGuard } from 'src/app/guards/usuario.guard';



export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',     component: DashboardComponent, canActivate:[UsuarioGuard] },
    { path: 'devices',      component: DevicesComponent, canActivate:[UsuarioGuard]  },
    { path: 'alarms',      component: AlarmsComponent , canActivate:[UsuarioGuard] },
    { path: 'templates',      component: TemplatesComponent, canActivate:[UsuarioGuard]  },
    { path: 'tests',      component: TestsComponent, canActivate:[UsuarioGuard]  },


    // { path: 'user-profile',   component: UserProfileComponent },
    // { path: 'table-list',     component: TableListComponent },
    // { path: 'typography',     component: TypographyComponent },
    // { path: 'icons',          component: IconsComponent },
    // { path: 'maps',           component: MapsComponent },
    // { path: 'notifications',  component: NotificationsComponent },
    // { path: 'upgrade',        component: UpgradeComponent }
];

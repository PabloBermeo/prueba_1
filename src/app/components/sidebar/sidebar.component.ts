import { Component, OnInit } from '@angular/core';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'design_app', class: '' },
    { path: '/devices', title: 'Devices',  icon: 'design_bullet-list-67', class: '' },
    { path: '/alarms', title: 'Alarms',  icon: 'ui-1_bell-53', class: '' },
    { path: '/templates', title: 'Templates',  icon: 'design-2_ruler-pencil', class: '' },
    { path: '/tests', title: 'Tests',  icon: 'education_atom', class: '' },
    
    
    

];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[]=[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ( window.innerWidth > 991) {
          return false;
      }
      return true;
  };
}

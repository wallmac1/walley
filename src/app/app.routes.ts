import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TicketNewComponent } from './tickets/ticket-new/ticket-new.component';

export const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "home", component: NavbarComponent},
    { path: "newTicket", component: TicketNewComponent }
];

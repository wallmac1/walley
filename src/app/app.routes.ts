import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TicketNewComponent } from './tickets/ticket-new/ticket-new.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { TicketModifyComponent } from './tickets/ticket-modify/ticket-modify.component';

export const routes: Routes = [
    { path: "", redirectTo: "newTicket", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "newTicket", component: TicketNewComponent },
    { path: "recoverPassword", component: RecoverPasswordComponent },
    { path: "modifyTicket/:id", component: TicketModifyComponent },
    { path: "newPassword", component: NewPasswordComponent }
];

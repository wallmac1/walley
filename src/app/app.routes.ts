import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TicketNewComponent } from './tickets/ticket-new/ticket-new.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { TicketModifyComponent } from './tickets/ticket-modify/ticket-modify.component';
import { DeleteComponent } from './settings/menu/delete/delete.component';
import { AuthorizationsComponent } from './weco/authorizations/authorizations.component';
import { SystemsListComponent } from './weco/system/systems-list/systems-list.component';
import { AssistanceComponent } from './weco/assistance/assistance.component';
import { SystemReviewComponent } from './weco/system/system-review/system-review.component';

export const routes: Routes = [
    { path: "", redirectTo: "login", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "newTicket", component: TicketNewComponent },
    { path: "recoverPassword", component: RecoverPasswordComponent },
    { path: "modifyTicket/:id", component: TicketModifyComponent },
    { path: "newPassword", component: NewPasswordComponent },
    { path: "menu/delete", component: DeleteComponent },
    { path: "authorizations", component: AuthorizationsComponent },
    { path: "systemsList", component: SystemsListComponent },
    { path: "assistance", component: AssistanceComponent },
    { path: "systemReview/:id", component: SystemReviewComponent }
];

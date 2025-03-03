import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
//import { TicketNewComponent } from './tickets/ticket-new/ticket-new.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
//import { TicketModifyComponent } from './tickets/ticket-modify/ticket-modify.component';
import { DeleteComponent } from './settings/menu/delete/delete.component';
import { AuthorizationsComponent } from './weco/authorizations/authorizations.component';
import { SystemsListComponent } from './weco/system/systems-list/systems-list.component';
import { AssistanceComponent } from './weco/assistance/assistance.component';
import { SystemReviewComponent } from './weco/system/system-review/system-review.component';
import { VoucherInfoComponent } from './voucher/voucher-info/voucher-info.component';
import { VoucherListComponent } from './voucher/voucher-list/voucher-list.component';
//import { TicketListComponent } from './tickets/ticket-list/ticket-list.component';
import { AccessPageComponent } from './tickets/access-page/access-page.component';
import { ArticleNewComponent } from './articles/article-new/article-new.component';
import { ArticleModifyComponent } from './articles/article-modify/article-modify.component';
import { InvoiceListComponent } from './invoices/invoice-list/invoice-list.component';
import { InvoiceInfoComponent } from './invoices/invoice-info/invoice-info.component';
import { BankModifyComponent } from './bank/bank-modify/bank-modify.component';
import { BankListComponent } from './bank/bank-list/bank-list.component';
import { GeneralMenuComponent } from './invoices/menu/general-menu/general-menu.component';
import { CustomerNewComponent } from './customer/customer-new/customer-new.component';
import { CompanyRegistryComponent } from './company/company-registry/company-registry.component';
import { CustomerContainerComponent } from './customer/customer-container/customer-container.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { EventsListComponent } from './events/events-list/events-list.component';
import { PaymentConditionsComponent } from './payment-conditions/payment-conditions.component';
import { InvoiceReadonlyComponent } from './invoices/invoice-readonly/invoice-readonly.component';
import { SystemTicketsListComponent } from './weco/system/system-tickets-list/system-tickets-list.component';
import { TicketListComponent } from './weco/tickets/ticket-list/ticket-list.component';
import { TicketNewComponent } from './weco/tickets/ticket-new/ticket-new.component';
// import { TicketListComponent } from './weco/tickets/ticket-list/ticket-list.component';
// import { TicketNewComponent } from './weco/tickets/ticket-new/ticket-new.component';
import { TicketModifyComponent } from './weco/tickets/ticket-modify/ticket-modify.component';

export const routes: Routes = [
    { path: "", redirectTo: "login", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "newTicket", component: TicketNewComponent },
    { path: "recoverPassword", component: RecoverPasswordComponent },
    { path: "ticket/:id", component: TicketModifyComponent },
    { path: "ticketsList", component: TicketListComponent },
    { path: "access", component: AccessPageComponent },
    { path: "newPassword", component: NewPasswordComponent },
    { path: "menu/delete", component: DeleteComponent },
    { path: "authorizations", component: AuthorizationsComponent },
    { path: "systemsList", component: SystemsListComponent },
    { path: "assistance", component: AssistanceComponent },
    { path: "systemReview/:id", component: SystemReviewComponent },
    { path: "voucher/:id", component: VoucherInfoComponent },
    { path: "voucherList", component: VoucherListComponent },
    { path: "newArticle", component: ArticleNewComponent },
    { path: "article/:id", component: ArticleModifyComponent },
    { path: "invoiceList", component: InvoiceListComponent },
    { path: "invoice/:id", component: InvoiceInfoComponent },
    { path: "bankModify/:id", component: BankModifyComponent },
    { path: "bankList", component: BankListComponent },
    { path: "generalMenu", component: GeneralMenuComponent },
    { path: "customer/new", component: CustomerNewComponent },
    { path: "customer/edit/:id", component: CustomerContainerComponent },
    { path: "customerList", component: CustomerListComponent },
    { path: "companyRegistry/:id", component: CompanyRegistryComponent },
    { path: "eventList", component: EventsListComponent },
    { path: "paymentConditions", component: PaymentConditionsComponent },
    { path: "invoice/readonly/:id", component: InvoiceReadonlyComponent },
    { path: "systemTicketList/:id", component: SystemTicketsListComponent },
    // { path: "ticketWecoList", component: SystemReviewComponent },
    // { path: "ticketListWeco", component: TicketListComponent },
    // { path: "ticketNewWeco", component: TicketNewComponent },
    // { path: "ticketModifyWeco/:id", component: TicketModifyComponent },
    { path: '**', redirectTo: '/login' },
];

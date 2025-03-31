import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Customer } from '../../../tickets/interfaces/customer';

export function customerValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        return isCustomer(value) ? null : { invalidCustomer: true };
    };
}

export function isCustomer(obj: any): obj is Customer {
    return obj && typeof obj === 'object' && 'id' in obj && typeof obj.id === 'number';
}
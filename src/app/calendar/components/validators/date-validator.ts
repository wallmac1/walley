import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const start = group.get('date_start')?.value;
        const end = group.get('date_end')?.value;

        if (!start || !end) {
            return null; // Uno dei due campi è vuoto
        }

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (startDate > endDate) {
            return { dateRangeInvalid: true };
        }

        return null;
    };
}
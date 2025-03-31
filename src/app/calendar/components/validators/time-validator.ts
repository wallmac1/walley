import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function timeRangeValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const startTime = group.get('time_start')?.value;
        const endTime = group.get('time_end')?.value;

        if (!startTime || !endTime) {
            if(group.get('isallday')?.value == 1 || group.get('isallday')?.value == true) {
                return null;
            }
            else {
                return { required: true };
            }
        }

        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        const start = startHour * 60 + startMinute;
        const end = endHour * 60 + endMinute;

        if (start > end) {
            return { timeRangeInvalid: true };
        }

        return null;
    };
}
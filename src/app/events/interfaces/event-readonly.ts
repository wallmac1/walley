export interface EventReadonly {
    idevent: number;
    event_type: {type: number; name: string}; // 0 MEMO, 1 GENERIC, 2 SALA, 3 COURSE
    title: string;
    description: string;
    internal: {type: number; title: string}; // 0 EXTERNAL, 1 INTERNAL, 2 OTHER
    date_start: string;
    date_end: string;
    time_start: string;
    time_end: string;
    isallday: number;
    room: string;
    course: {id: number; title: string; color: string};
    contact: {id: number; name: string};
    customer: {id: number; name: string};
    customer_headquarter: string;
    internal_person: string;
    internal_headquarter: number;
    keepinformed: string;
}
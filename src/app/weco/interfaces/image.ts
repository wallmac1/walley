import { SafeUrl } from "@angular/platform-browser";

export interface Image {
    id: number;
    title: string;
    src: string | SafeUrl;
}

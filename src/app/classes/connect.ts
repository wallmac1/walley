import { environment } from "../../environments/environment.development";

export class Connect {
    static urlServerLaraApi = environment.urlserver.laravelApi;
    static urlServerLara = environment.urlserver.laravel;
    static urlServerLaraFile = environment.urlserver.laravelApi+'files/';
    static IPINFO_URL = "https://ipinfo.io";
    static IPINFO_API_TOKEN = "91c44cd0fcb4c9";

    static FOLDER_STEP_TWO = "location/";
    static FOLDER_STEP_THREE = "supplier/";
    static FILE_SIZE = 11;
    static FILE_SIZE_STRING = "11" 
}
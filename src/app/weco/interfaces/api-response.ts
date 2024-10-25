export interface ApiResponse<T> {
  // 200: success, 511: warning
  code: number;
  data: T;
  title: string;
  message: string;
  // 1: toast se null o altro apre il dialog
  type_alert?: number | null;
  obj_toast?: null | {
    closeButton?: number;
    disableTimeOut?: number;
  };
  obj_dialog?: null | {
    disableClose: number;
    obj_buttonClose?: ObjButtonPopup;
    obj_buttonAction?: ObjButtonPopup;
  }
}

export interface ObjButtonPopup {
  // 1 se vuoi fare qualcosa dopo la chiusura
  action: number | null;
  // 1: router.navigate, 2: esegui funzione
  action_type: number | null;
  urlfront?: string | null;
  urlparam?: string | null;
  label: string;
  run_function?: (val?: number) => void;
}

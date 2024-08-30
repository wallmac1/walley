export interface User {
  id: number;
  nickname: string;
  email: string;
  name: string;
  surname: string;
  fiscalcode?: string;
  company_name?: string;
  country: string;
  cca2: string;
  ccn3: string;
  vat: string;
  phone: string;
  phone_whatsapp: string;
  licensenumber: string;
  lang_code: null | string;
}


export interface StepFour {
  product_systemcomposition: number | null;
  product_systemweco: number | null;
  product_installdate: string | null;
  product_brand: string | null;
  inverter_hybrid: number | null | boolean;
  inverter_online: number | null | boolean;
  refidwecaresystemvolt: number | null;
  system_model: number | null;
  refidwecaresystemtype: number | null;
  cluster_singlebattery: number | null;
  cluster_numberdevices: number | null;
  str_refidwecaresystemvolt?: string;
  str_refidwecaresystemtype?: string;
  str_system_model?: string;
}

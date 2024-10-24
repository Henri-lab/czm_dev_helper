export interface ViewerConfig {
  containerId: string;
  baseConfig?: any;
  providerConfig?: mapProviderConfig;
  extraConfig?: any;
}
export interface imageryProviderConfig {
  type: string;
  option: any;
}
export interface terrianProviderConfig {
  type: string;
  option: any;
}
export interface mapProviderConfig {
  [key: string]: Array<any>;
}


export interface viewerConfig {
  containerId: string;
  baseConfig?: any;
  providerConfig?: mapProviderConfig;
  extraConfig?: any;
}
export interface imageryProviderConfig {
  type: string;
  option: any;
  //             {
  //               type:string,
  //               option: {
  //                   customProvider?:mapProvider
  //               },
}
export interface terrianProviderConfig {
  type: string;
  option: any;
}
export interface mapProviderConfig {
  [key: string]: Array<any>;
  // terrainProvider?: Array<any>;
  // imageryProvider?: Array<any>;
}

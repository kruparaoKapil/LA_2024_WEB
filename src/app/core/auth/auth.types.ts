export interface CompanyDetails {
  pCompanyName?: string;
  pAddress1?: string;
  pAddress2?: string;
  pcity?: string;
  pCountry?: string;
  pState?: string;
  pDistrict?: string;
  pPincode?: string;
  pCinNo?: string;
  pGstinNo?: string;
  pBranchname?: string;
  [key: string]: unknown;
}

export interface RoleFunction {
  pFunctionUrl: string;
  pIsviewpermission: boolean;
  pIsaddpermission?: boolean;
  pIseditpermission?: boolean;
  pIsdeletepermission?: boolean;
  pIsprintpermission?: boolean;
  [key: string]: unknown;
}

export interface UserRolePackage {
  pUserID?: number | string;
  pUserName?: string;
  pDesignation?: string;
  functionsDTOList?: RoleFunction[];
  [key: string]: unknown;
}

export interface CurrentUser {
  pUserID?: number | string;
  pUserName?: string;
  pToken?: string;
  pBranch?: string;
  [key: string]: unknown;
}

export interface BranchSelection {
  pBranchID?: number | string;
  pBranchName?: string;
  [key: string]: unknown;
}

export interface LoginRequest {
  username: string;
  password: string;
  [key: string]: unknown;
}

export interface LoginResponse {
  user?: CurrentUser;
  roles?: UserRolePackage;
  company?: CompanyDetails;
  token?: string;
  otpRequired?: boolean;
  [key: string]: unknown;
}

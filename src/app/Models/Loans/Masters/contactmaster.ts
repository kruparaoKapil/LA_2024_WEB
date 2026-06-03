import { Time } from '@angular/common';

export interface Contactmaster {
  pName?: string;
  pContactId?: number;
  pReferenceId?: string;
  pContactType?: string;
  pSurName?: string;
  pDob?: string;
  pGender?: string;
  pGenderCode?: string;
  pFatherName?: string;
  pSpouseName?: string;
  pTypeofEnterprise?: string;
  pNatureofBussiness?: string;
  pStatusId?: number;
  pCreatedBy?: number;
  pCreatedDate?: Time;
  pModifiedBy?: number;
  pMidifiedDate?: Time;
  pBusinesscontactreferenceid?: string;
  pBusinesscontactName?: string;
  pAge?: number;
  pTitle?: string;

  pAddressList?: Contactaddress[];
  pcontactdetailslist?: Conatactdetais[];
}

export interface Contactaddress {
  pAddressType?: string;
  pAddress1?: string;
  pAddress2?: string;
  pState?: string;
  pStateId?: number;
  pDistrict?: string;
  pDistrictId?: string;
  pCity?: string;
  pCityId?: number;
  pCountry?: string;
  pCountryId?: string;
  pPinCode?: number;
  pPriority?: string;
}

export interface Conatactdetais {
  pPriority?: string;
  pEmailId1?: string;
  pEmailId2?: string;
  pContactNo?: string;
  pAlternativeNo?: string;
  pBusinessContactNo?: string;
}

export interface FiPersonalinformationModel {
  papplicationid?: number;
  pvchapplicationid?: string;
  pIspersonaldetailsapplicable? : boolean,
  PersonalDetailsList?: ApplicationPersonalDetailsModel[];
  PersonalEmployeementList?: ApplicationPersonalEmployeementModel[]
  PersonalFamilyList?: ApplicationPersonalFamilyModel[];
  PersonalNomineeList?: ApplicationPersonalNomineeModel[];
  PersonalBankList?: ApplicationPersonalBankModel[];
  PersonalIncomeList?: ApplicationPersonalIncomeModel[];
  PersonalOtherIncomeList?: ApplicationPersonalOtherIncomeModel[];
  PersonalEducationList?: ApplicationPersonalEducationModel[];
  businessDetailsDTOList?:ApplicationbusinessactivityModel[];
  businessfinancialdetailsDTOList?: ApplicationbusinessfinancialModel[];
  pCreatedby?: any
  pStatusname?: string;
  ptypeofoperation?: string;
}
export interface ApplicationPersonalEmployeementModel {
  precordid?: number;
  pcontactid?: number;
  pcontactreferenceid?: string;
  papplicanttype?: string;
  pisapplicable?: boolean;
  pemploymenttype?: string;
  pnameoftheorganization?: string;
  pEnterpriseType?: string;
  pemploymentrole?: string;
  pofficeaddress?: string;
  pofficephoneno?: string;

  preportingto?: string;
  pemployeeexp?: any;
  pemployeeexptype?: string;
  ptotalworkexp?: any;
  pdateofestablishment?: string;
  pdateofcommencement?: string;
  pgstinno?: string;
  pcinno?: string;
  pdinno?: string;
  ptradelicenseno?: string;
  pCreatedby?: number
  pStatusname?: string;
  ptypeofoperation?: string;
}

export interface ApplicationPersonalDetailsModel {
  pisapplicable?: boolean;
  precordid?: number;
  pcontactid?: number;
  pcontactreferenceid?: string;
  presidentialstatus?: string;
  pmaritalstatus?: string;
  pplaceofbirth?: string;
  pcountryofbirth?: string;
  pnationality?: string;
  pminoritycommunity?: string;
  pCreatedby?: number
  pStatusname?: string;
  ptypeofoperation?: string;
}
export interface ApplicationPersonalFamilyModel {
  pisapplicable?: boolean;
  precordid?: number;
  pcontactid?: number;
  pcontactreferenceid?: string;
  ptotalnoofmembers?: number;
  pnoofearningmembers?: number;
  pfamilytype?: string;
  pnoofboyschild?: number;
  pnoofgirlchild?: number;
  phouseownership?: string;
  pCreatedby?: number;
  pStatusname?: string;
  ptypeofoperation?: string;
}

export interface ApplicationPersonalNomineeModel {
  pisapplicable?: boolean;
  precordid?: number;
  pcontactid?: number;
  pcontactreferenceid?: string;
  pnomineename?: string;
  prelationship?: string;
  pdateofbirth?: Date;
  pcontactno?: string;
  pidprooftype?: string;
  pidproofname?: string;
  preferencenumber?: string;
  pdocidproofpath?: string;
  pCreatedby?: number
  pStatusname?: string;
  ptypeofoperation?: string;
}
export interface ApplicationPersonalBankModel {
  pisapplicable?: boolean;
  precordid?: number;
  pcontactid?: number;
  pcontactreferenceid?: string;
  pBankAccountname?: string;
  pBankName?: string;
  pBankAccountNo?: string;
  pBankifscCode?: string;
  pBankBranch?: string;
  pIsprimaryAccount?: boolean;
  pCreatedby?: number
  pStatusname?: string;
  ptypeofoperation?: string;
}
export interface ApplicationPersonalIncomeModel {
  pisapplicable?: boolean;
  precordid?: number;
  pcontactid?: number;
  pcontactreferenceid?: string;
  pgrossannualincome?: number;
  pnetannualincome?: number;
  paverageannualexpenses?: number;
  pCreatedby?: number
  pStatusname?: string;
  ptypeofoperation?: string;
}
export interface ApplicationPersonalOtherIncomeModel {
  pisapplicable?: boolean;
  precordid?: number;
  pcontactid?: number;
  pcontactreferenceid?: string;
  psourcename?: string;
  pgrossannual?: any;
  pCreatedby?: number
  pStatusname?: string;
  ptypeofoperation?: string;
}
export interface ApplicationPersonalEducationModel {
  pisapplicable?: boolean;
  precordid?: number;
  pcontactid?: number;
  pcontactreferenceid?: string;
  pqualification?: string;
  pnameofthecourseorprofession?: string;
  poccupation?: string;
  pCreatedby?: number
  pStatusname?: string;
  ptypeofoperation?: string;
}

export interface ApplicationbusinessfinancialModel {
      createdby?: number;
      modifiedby?: number;
      precordid?: number;
      pcontactid?: number;
      pcontactreferenceid?: string;
      pfinancialyear?: string;
      pturnoveramount?: number;
      pnetprofitamount?: number;
      pdocbalancesheetpath?: string;
      pCreatedby?: number;
      pModifiedby?: number;
      pStatusid?: string;
      pStatusname?: string;
      pEffectfromdate?: string;
      pEffecttodate?: string;
      ptypeofoperation?: string;
      pisapplicable?: any;
}
export interface ApplicationbusinessactivityModel {
  createdby?: number;
  modifiedby?: number;
  precordid?: number;
  pcontactid?: number;
  pisapplicable?: boolean;

  pcontactreferenceid?: string;
  pbusinessactivity?: string;
  pestablishmentdate?: Date;
  pcommencementdate?: Date;
  pcinnumber?: string;
  pgstinno?:string;
  pCreatedby?: number;
  pModifiedby?: number;
  pStatusid?: string;
  pStatusname?: string;
  pEffectfromdate?: string;
  pEffecttodate?: string;
  ptypeofoperation?: string;
 
    

}
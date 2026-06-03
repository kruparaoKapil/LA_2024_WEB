import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { DataBindingDirective, PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-rdloanandfacility',
  templateUrl: './rdloanandfacility.component.html',
  styles: []
})
export class RdloanandfacilityComponent implements OnInit {
  Rdloanfacilityform:FormGroup;
 // @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;;
  constructor(private fb:FormBuilder,private _CommonService:CommonService) { }
  days:any;
  isloanfacilityaplicable=false
  isloanage=false
  islockin=false;
  islockintest=false;
  islatefeeapplicable=false;
  percentagefrom: any;
  percentageto: any;
  Griddata:any=[];
  forFixed:boolean = false;
  forPercentage:boolean = false;
  RdLoanfacilityerrors:any;
  ermsg:any;
  public maxInterestrateto='0';
  public maxinvestmentperiodto='0';
  ngOnInit() 
  {
    this.isloanfacilityaplicable = false;
    this.maxInterestrateto='0';
    this.maxinvestmentperiodto='0';
    this.isloanage = false
    this.islockin = false;
    this.RdLoanfacilityerrors={};
    this.islatefeeapplicable=false;
    this.forFixed = true;
    this.forPercentage = false;
    this.islockintest=false;
    this.Griddata = [];
    this.Rdloanfacilityform = this.fb.group({
      precordid: 0,
      pIsloanfacilityapplicable: false,
      pEligiblepercentage: 0,
      pIsloanageperiod: false,
      pAgeperiod: 0,
      pAgeperiodtype: [''],
      pIsprematuretylockingperiod: false,
      pPrematuretyageperiod: 0,
      pPrematuretyageperiodtype: [''],
      pIslatefeepayble: false,
      pLatefeepaybletype: ['comfixed'],
      pLatefeepayblevalue: 0,
      pLatefeeapplicablefrom: 0,
      pLatefeeapplicabletype: [''],
      pTypeofOperation:['CREATE'] ,
      pCreatedby: [this._CommonService.pCreatedby],
      "_RecurringDepositPrematurityInterestPercentages": new FormGroup
      ({
        "pRecordid": new FormControl('0'),
        "pminprematuritypercentage": new FormControl(''),
        "pmaxprematuritypercentage": new FormControl(''),
        "pPercentage": new FormControl(''),
        "pprematurityperiodtype": new FormControl(''),
        "pTypeofOperation": new FormControl('CREATE')
      })
    })
    this.BlurEventAllControll(this.Rdloanfacilityform);
  }
  ValidateGridData()
  {
    debugger
    let isValid=true;
    if(this.Griddata.length==0)
    {

    }
    let from;
    let to;
    if (this.Rdloanfacilityform.controls._RecurringDepositPrematurityInterestPercentages.value.pminprematuritypercentage != null)
    from =this.Rdloanfacilityform.controls._RecurringDepositPrematurityInterestPercentages.value.pminprematuritypercentage;
    if (this.Rdloanfacilityform.controls._RecurringDepositPrematurityInterestPercentages.value.pmaxprematuritypercentage != null)
    to =this.Rdloanfacilityform.controls._RecurringDepositPrematurityInterestPercentages.value.pmaxprematuritypercentage;

    // let Applicanttype = this.chequemanagementform.controls.pApplicanttype.value;


    let data = this.Griddata;
    if(from!=0 || to!=0)
    {
      if (data != null) {
        if (data.length >= 0) {
  
  
          for (let i = 0; i < data.length; i++) {
  
            let fromdays;
            let todays;
            if (data[i].pminprematuritypercentage != null)
            fromdays =(data[i].pminprematuritypercentage);
            if (data[i].pmaxprematuritypercentage != null)
            todays = (data[i].pmaxprematuritypercentage);
  
  
  
            if (this.Rdloanfacilityform.controls._RecurringDepositPrematurityInterestPercentages.value.pprematurityperiodtype == data[i].pprematurityperiodtype)
             {
  
              if (parseFloat(from) >= parseFloat(fromdays) && parseFloat(from) <= parseFloat(todays)) {
                //this.showErrorMessage('Given range already exists');
               
                isValid = false;
                this.ermsg="Tenure Already Exists"
                break;
              }
              if (parseFloat(to) >= parseFloat(fromdays) && parseFloat(to) <= parseFloat(todays)) {
                //this.showErrorMessage('Given range already exists');
                isValid = false;
                this.ermsg="Tenure Already Exists"
                break;
              }
              if (parseFloat(from) <= parseFloat(fromdays) && parseFloat(to) >= parseFloat(todays)) {
                //this.showErrorMessage('Given range already exists');
                isValid = false;
                this.ermsg="Tenure Already Exists"
                break;
              }
              if (parseFloat(from) >= parseFloat(fromdays) && parseFloat(to) <= parseFloat(todays)) {
                //this.showErrorMessage('Given range already exists');
                isValid = false;
                this.ermsg="Tenure Already Exists"
                break;
              }
  
         
            }
            else
            {
              this.ermsg="You Must Select Same Tenure Mode";
              
              isValid=false;
            }
  
          }
        }
  
      }
    }
   
    return isValid
  }
  pPrematuretyageperiod_Change(event){
    debugger;
    let ageperiod=parseFloat(event.target.value);
    //allows zero as per requirements(KT)
    if(ageperiod== null){
       this.Rdloanfacilityform.controls.pPrematuretyageperiod.setValue('');
    }
  }
  prematuretypeselected(event)
  {
   debugger
   this.days=event.target.value;
   this.Period_Change('To');
  }
   Period_Change(textboxname){
    debugger;
    let Noofdays;
    let convertiondays;
    let period;
    let periodtype;
    if(Number(this.maxinvestmentperiodto)>0){
     if(textboxname=='Age'){
     period=this.Rdloanfacilityform.controls.pAgeperiod.value;
     periodtype=this.Rdloanfacilityform.controls.pAgeperiodtype.value;
     }
     else if(textboxname=='Lockin'){
    period=this.Rdloanfacilityform.controls.pPrematuretyageperiod.value;
    periodtype=this.Rdloanfacilityform.controls.pPrematuretyageperiodtype.value;
     }
     else if(textboxname=='To'){
    period=this.Rdloanfacilityform.controls._RecurringDepositPrematurityInterestPercentages['controls'].pmaxprematuritypercentage.value;
    periodtype=this.Rdloanfacilityform.controls._RecurringDepositPrematurityInterestPercentages['controls'].pprematurityperiodtype.value;
     }
    if (period != 0 && period != null && periodtype !='') {
      let a = period
      if(periodtype=='Years'){
        Noofdays =Number(a * 365);
        convertiondays=Math.round(Number(this.maxinvestmentperiodto)/365);
       }
      else if(periodtype=='Months'){
       Noofdays =Number( a * 30);
        convertiondays=Math.round(Number(this.maxinvestmentperiodto)/30);
      }
      else{
       Noofdays = Number(a);
        convertiondays=this.maxinvestmentperiodto
      }
      if(Noofdays>Number(this.maxinvestmentperiodto)){
        if(textboxname=='Age'){
        this._CommonService.showWarningMessage('Age of Deposit for Availing loan must be less than or equal to Max investment Period ('+convertiondays+' '+ periodtype +')');
        this.Rdloanfacilityform.controls.pAgeperiod.setValue('');
         this.Rdloanfacilityform.controls.pAgeperiodtype.setValue('Days');
        return;
        }
        else if(textboxname=='Lockin'){
        this._CommonService.showWarningMessage('Lockin Period must be less than or equal to Max investment Period ('+convertiondays+' '+ periodtype +')');
        this.Rdloanfacilityform.controls.pPrematuretyageperiod.setValue('');
         this.Rdloanfacilityform.controls.pPrematuretyageperiodtype.setValue('Days');
        return;
        }
         else if(textboxname=='To'){
        this._CommonService.showWarningMessage('Pre-Mature To must be less than or equal to Max investment Period ('+convertiondays+' '+ periodtype +')');
        this.Rdloanfacilityform.controls._RecurringDepositPrematurityInterestPercentages['controls'].pmaxprematuritypercentage.setValue("");
        this.Rdloanfacilityform.controls._RecurringDepositPrematurityInterestPercentages['controls'].pprematurityperiodtype.setValue('Days');

        return;
        }
      }
    }
    }

  }
  Validaations(type){
    const Lanfacilitycontrols = <FormGroup>this.Rdloanfacilityform.controls['_RecurringDepositPrematurityInterestPercentages'];
    if(type=='ADD'){
      Lanfacilitycontrols.controls.pminprematuritypercentage.setValidators(Validators.required)
      Lanfacilitycontrols.controls.pmaxprematuritypercentage.setValidators(Validators.required)
      Lanfacilitycontrols.controls.pPercentage.setValidators(Validators.required)
      Lanfacilitycontrols.controls.pprematurityperiodtype.setValidators(Validators.required)

    }
    else{
      Lanfacilitycontrols.controls.pminprematuritypercentage.clearValidators();
      Lanfacilitycontrols.controls.pmaxprematuritypercentage.clearValidators();
      Lanfacilitycontrols.controls.pPercentage.clearValidators();
      Lanfacilitycontrols.controls.pprematurityperiodtype.clearValidators();
    }
     Lanfacilitycontrols.controls.pminprematuritypercentage.updateValueAndValidity();
      Lanfacilitycontrols.controls.pmaxprematuritypercentage.updateValueAndValidity();
      Lanfacilitycontrols.controls.pPercentage.updateValueAndValidity();
      Lanfacilitycontrols.controls.pprematurityperiodtype.updateValueAndValidity();
      this.BlurEventAllControll(Lanfacilitycontrols);
  }
  Addtogrid()
  {
    debugger
    let isValid=true;
    let isloanfacilityValid = true;
    const Lanfacilitycontrols = <FormGroup>this.Rdloanfacilityform.controls['_RecurringDepositPrematurityInterestPercentages'];
    this.Validaations('ADD');
    isloanfacilityValid = this.checkValidations(Lanfacilitycontrols, isloanfacilityValid);
    if(isloanfacilityValid)
    {
      if(this.ValidateGridData())
      {
         if(parseFloat(this.maxInterestrateto)>0){
        let newpercentage=parseFloat( this.Rdloanfacilityform['controls']['_RecurringDepositPrematurityInterestPercentages']['controls']['pPercentage'].value)
        if(newpercentage>parseFloat(this.maxInterestrateto)){
          this._CommonService.showWarningMessage('Percentage must be less than or equal to Max interest Rate ('+ this.maxInterestrateto + ')');
           this.Rdloanfacilityform['controls']['_RecurringDepositPrematurityInterestPercentages']['controls']['pPercentage'].setValue("");
           return;
        }
        }
       this.Griddata.push(this.Rdloanfacilityform.controls._RecurringDepositPrematurityInterestPercentages.value)
       this.Rdloanfacilityform['controls']['_RecurringDepositPrematurityInterestPercentages']['controls']['pminprematuritypercentage'].setValue("")
       this.Rdloanfacilityform['controls']['_RecurringDepositPrematurityInterestPercentages']['controls']['pmaxprematuritypercentage'].setValue("")
       this.Rdloanfacilityform['controls']['_RecurringDepositPrematurityInterestPercentages']['controls']['pPercentage'].setValue("")
       this.Rdloanfacilityform['controls']['_RecurringDepositPrematurityInterestPercentages']['controls']['pprematurityperiodtype'].setValue("");
        this.Validaations('REMOVE');
       this.RdLoanfacilityerrors={}
      }
      else{
           this._CommonService.showWarningMessage(this.ermsg)
          
      }
      
    }
     
    this.percentageto="";
    this.percentagefrom=""
     console.log(this.Rdloanfacilityform.value);
     
  }
  Frompercentage(event)
  {
    debugger
    this.percentagefrom=parseInt(event.target.value);
    if(this.percentageto!="")
    {
      if(this.percentageto<this.percentagefrom)
      {
        this._CommonService.showWarningMessage("To should not be less than From");
        this.Rdloanfacilityform.controls._RecurringDepositPrematurityInterestPercentages['controls'].pminprematuritypercentage.setValue("")
      }
    }
   
  }
  Topercentage(event)
  {
    debugger
    this.percentageto=parseInt(event.target.value)
    if(this.percentagefrom!="")
    {
      if(this.percentageto<this.percentagefrom)
      {
        this._CommonService.showWarningMessage("To should not be less than From");
        this.Rdloanfacilityform.controls._RecurringDepositPrematurityInterestPercentages['controls'].pmaxprematuritypercentage.setValue("")
      }
      else{
        this.Period_Change('To');
      }
    }
   
  }
  Loanfacility(event)
  {
    this.Rdloanfacilityform.patchValue({
      pEligiblepercentage: '',
      pAgeperiodtype:'',
      pAgeperiod:'',
    })
     this.RdLoanfacilityerrors.pEligiblepercentage='';
    this.RdLoanfacilityerrors.pAgeperiodtype='';
    this.RdLoanfacilityerrors.pAgeperiod='';
    this.ValidateLoanFacility();
  }
  ValidateLoanFacility(){
    debugger;
    if( this.Rdloanfacilityform.controls.pIsloanfacilityapplicable.value==true)
    {
      this.isloanfacilityaplicable=true;
       this.Rdloanfacilityform.controls.pEligiblepercentage.setValidators(Validators.required);
      this.Rdloanfacilityform.controls.pAgeperiodtype.setValidators(Validators.required);
      this.Rdloanfacilityform.controls.pAgeperiod.setValidators(Validators.required);

      this.Rdloanfacilityform.controls.pEligiblepercentage.updateValueAndValidity();
      this.Rdloanfacilityform.controls.pAgeperiodtype.updateValueAndValidity();
      this.Rdloanfacilityform.controls.pAgeperiod.updateValueAndValidity();

    }
    else{
      this.isloanfacilityaplicable=false;
       this.Rdloanfacilityform.controls.pEligiblepercentage.clearValidators();
      this.Rdloanfacilityform.controls.pAgeperiodtype.clearValidators();
      this.Rdloanfacilityform.controls.pAgeperiod.clearValidators();

      this.Rdloanfacilityform.controls.pEligiblepercentage.updateValueAndValidity();
      this.Rdloanfacilityform.controls.pAgeperiodtype.updateValueAndValidity();
      this.Rdloanfacilityform.controls.pAgeperiod.updateValueAndValidity();
    }
     this.BlurEventAllControll(this.Rdloanfacilityform);
  }
  Loanageperiod(event)
  {
    this.Rdloanfacilityform.patchValue({
      pAgeperiod: ''
    })
    if(event.target.checked)
    {
      this.isloanage=true
    }
    else{
      this.isloanage=false
    }
  }
  Lockinperiod(event)
  {
    this.Rdloanfacilityform.patchValue({
      pPrematuretyageperiod: '',
      pPrematuretyageperiodtype:'',
    })
     this.Rdloanfacilityform.controls._RecurringDepositPrematurityInterestPercentages.patchValue({
      pminprematuritypercentage:'',
      pmaxprematuritypercentage:'',
      pprematurityperiodtype:'',
      pPercentage:''
    })
     
    this.Griddata=[];
    this.ValidateLockinPeriod();
    
  }
  ValidateLockinPeriod(){
    debugger;
    this.RdLoanfacilityerrors.pprematurityperiodtype='';
    this.RdLoanfacilityerrors.pPercentage='';
    this.RdLoanfacilityerrors.pmaxprematuritypercentage='';
    this.RdLoanfacilityerrors.pminprematuritypercentage='';
    if(this.Rdloanfacilityform.controls.pIsprematuretylockingperiod.value==true)
    {
      this.islockin=true;
      this.islockintest=true;
      this.Rdloanfacilityform.controls.pPrematuretyageperiod.setValidators(Validators.required);
      this.Rdloanfacilityform.controls.pPrematuretyageperiodtype.setValidators(Validators.required);
      this.Rdloanfacilityform.controls.pPrematuretyageperiod.updateValueAndValidity();
       this.Rdloanfacilityform.controls.pPrematuretyageperiodtype.updateValueAndValidity();
      }
    else{
      this.islockin=false;
      this.islockintest=false;
      this.Rdloanfacilityform.controls.pPrematuretyageperiod.clearValidators();
      this.Rdloanfacilityform.controls.pPrematuretyageperiodtype.clearValidators();
      this.Rdloanfacilityform.controls.pPrematuretyageperiod.updateValueAndValidity();
       this.Rdloanfacilityform.controls.pPrematuretyageperiodtype.updateValueAndValidity();
    }
     this.BlurEventAllControll(this.Rdloanfacilityform);
  }
  LatefeeapplicableEdit(){
    debugger;
    if(this.Rdloanfacilityform.controls.pIslatefeepayble.value)
    {
      this.islatefeeapplicable=true;
      this.Rdloanfacilityform.controls.pLatefeepayblevalue.setValidators(Validators.required);
      this.Rdloanfacilityform.controls.pLatefeeapplicablefrom.setValidators(Validators.required);
      this.Rdloanfacilityform.controls.pLatefeeapplicabletype.setValidators(Validators.required);

      this.Rdloanfacilityform.controls.pLatefeepayblevalue.updateValueAndValidity();
      this.Rdloanfacilityform.controls.pLatefeeapplicablefrom.updateValueAndValidity();
      this.Rdloanfacilityform.controls.pLatefeeapplicabletype.updateValueAndValidity();
    }
    else{
      this.islatefeeapplicable=false;
      this.Rdloanfacilityform.controls.pLatefeepayblevalue.clearValidators();
      this.Rdloanfacilityform.controls.pLatefeeapplicablefrom.clearValidators();
      this.Rdloanfacilityform.controls.pLatefeeapplicabletype.clearValidators();

      this.Rdloanfacilityform.controls.pLatefeepayblevalue.updateValueAndValidity();
      this.Rdloanfacilityform.controls.pLatefeeapplicablefrom.updateValueAndValidity();
      this.Rdloanfacilityform.controls.pLatefeeapplicabletype.updateValueAndValidity();
    }
     this.BlurEventAllControll(this.Rdloanfacilityform);
  }
  Latefeeapplicable()
  {
    this.forFixed=true;
    this.forPercentage=false;
    this.Rdloanfacilityform.patchValue({
      pLatefeepaybletype: 'comfixed',
      pLatefeepayblevalue: '',
      pLatefeeapplicabletype:'Days',
      pLatefeeapplicablefrom:'0'
    })
    this.RdLoanfacilityerrors.pLatefeepayblevalue='';
    this.RdLoanfacilityerrors.pLatefeeapplicablefrom='';
    this.RdLoanfacilityerrors.pLatefeeapplicabletype='';
    this.LatefeeapplicableEdit();
  }

  latefeePayablechange(type) {
    
    if(type == 'fixed') {
      this.forFixed = true;
      this.forPercentage = false;
      this.Rdloanfacilityform.patchValue({
        pLatefeepayblevalue: ''
      })
    }
    else {
      this.forFixed = false;
      this.forPercentage = true;
      this.Rdloanfacilityform.patchValue({
        pLatefeepayblevalue: ''
      })
    }
     this.RdLoanfacilityerrors.pLatefeepayblevalue='';
  }
  checkValidations(group: FormGroup, isValid: boolean): boolean 
  {
    debugger
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
    return isValid;
  }
  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean 
  {
   debugger
    try {
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.RdLoanfacilityerrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.RdLoanfacilityerrors[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {
      // this.showErrorMessage(e);
      // return false;
    }
    return isValid;
  }
  showErrorMessage(errormsg: string) {
    this._CommonService.showErrorMessage(errormsg);
  }
  BlurEventAllControll(fromgroup: FormGroup) {
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
  }
  setBlurEvent(fromgroup: FormGroup, key: string) {
    try {
      let formcontrol;
      formcontrol = fromgroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.BlurEventAllControll(formcontrol)
        }
        else {
          if (formcontrol.validator)
            fromgroup.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
        }
      }
    }
    catch (e) {
      this.showErrorMessage(e);
      return false;
    }
  }
  removeHandler(event) {
    this.Griddata.splice(event.rowIndex, 1);
  }
}

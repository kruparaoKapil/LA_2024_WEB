import { Component, OnInit ,ViewChild} from '@angular/core';
import { FormGroup,FormControl,FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { DataBindingDirective, PageChangeEvent } from '@progress/kendo-angular-grid';
@Component({
  selector: 'app-fdloanandfacility',
  templateUrl: './fdloanandfacility.component.html',
  styles: []
})
export class FdloanandfacilityComponent implements OnInit {

  fdloanfacilityform: FormGroup;
  @ViewChild(DataBindingDirective, { static: true }) dataBinding: DataBindingDirective;
  percentagefrom: any;
  percentageto: any;
  constructor(private fb:FormBuilder,private _CommonService:CommonService) { }
  isloanfacilityaplicable=false
  isloanage=false
  islockin=false;
  ermsg:any;
  islockintest=false;
  days:any;
  Griddata:any=[]
  islatefeeapplicable=false;
  public pageSize = 10;
  public skip = 0;
  public maxInterestrateto='0';
  public maxinvestmentperiodto='0';
  public mySelection: string[] = [];
  forFixed:boolean = false;
  forPercentage:boolean = false;
  FdLoanfacilityerrors:any;
  prematurelist:any=[]
  ngOnInit() 
  {
    debugger;
    this.maxInterestrateto='0';
    this.maxinvestmentperiodto='0';
    this.isloanfacilityaplicable = false
    this.isloanage = false;
    this.islockin = false;
    this.FdLoanfacilityerrors={};
    this.prematurelist=[];
    this.islockintest=false
    this.islatefeeapplicable=false;
    this.forFixed = true;
    this.forPercentage = false;
    this.fdloanfacilityform = this.fb.group({
      precordid: 0,
      pIsloanfacilityapplicable: false,
      pEligiblepercentage: 0,
      pIsloanageperiod: false,
      pAgeperiod: 0,
      pAgeperiodtype: [''],
      pIsprematuretylockingperiod: false,
      pPrematuretyageperiod: 0,
      pPrematuretyageperiodtype: ['Days'],
      pIslatefeepayble: false,
      pLatefeepaybletype: ['comfixed'],
      pLatefeepayblevalue: 0,
      pLatefeeapplicablefrom: 0,
      pLatefeeapplicabletype: [''],
      pTypeofOperation:['CREATE'] ,
      pCreatedby: [this._CommonService.pCreatedby],
      "_FixedDepositPrematurityInterestPercentages": new FormGroup
      ({
        "pRecordid": new FormControl('0'),
        "pminprematuritypercentage": new FormControl(''),
        "pmaxprematuritypercentage": new FormControl(''),
        "pPercentage": new FormControl(''),
        "pprematurityperiodtype": new FormControl(''),
        "pTypeofOperation": new FormControl('CREATE')
      })
     
    })
    this.BlurEventAllControll(this.fdloanfacilityform);
  }
  Loanfacility()
  {
    debugger
    this.fdloanfacilityform.patchValue({
      pEligiblepercentage: '',
      pAgeperiod:'',
      pAgeperiodtype:'',
    });
      this.FdLoanfacilityerrors.pEligiblepercentage='';
    this.FdLoanfacilityerrors.pAgeperiodtype='';
    this.FdLoanfacilityerrors.pAgeperiod='';
    this.ValidateLoanFacility();
  }
  ValidateLoanFacility(){
    debugger;
    if(this.fdloanfacilityform.controls.pIsloanfacilityapplicable.value==true)
    {
      this.isloanage=true;
      this.fdloanfacilityform.controls.pEligiblepercentage.setValidators(Validators.required);
      this.fdloanfacilityform.controls.pAgeperiodtype.setValidators(Validators.required);
      this.fdloanfacilityform.controls.pAgeperiod.setValidators(Validators.required);

      this.fdloanfacilityform.controls.pEligiblepercentage.updateValueAndValidity();
      this.fdloanfacilityform.controls.pAgeperiodtype.updateValueAndValidity();
      this.fdloanfacilityform.controls.pAgeperiod.updateValueAndValidity();
    }
    else
    {
      this.isloanage=false
      this.fdloanfacilityform.controls.pEligiblepercentage.clearValidators();
      this.fdloanfacilityform.controls.pAgeperiodtype.clearValidators();
      this.fdloanfacilityform.controls.pAgeperiod.clearValidators();

      this.fdloanfacilityform.controls.pEligiblepercentage.updateValueAndValidity();
      this.fdloanfacilityform.controls.pAgeperiodtype.updateValueAndValidity();
      this.fdloanfacilityform.controls.pAgeperiod.updateValueAndValidity();
    }
    this.BlurEventAllControll(this.fdloanfacilityform);
  }
  Loanageperiod(event)
  {
    this.fdloanfacilityform.patchValue({
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
    debugger
    this.fdloanfacilityform.patchValue({
      pPrematuretyageperiod: '',
      pPrematuretyageperiodtype:'',
    })
         this.fdloanfacilityform.controls._FixedDepositPrematurityInterestPercentages.patchValue({
     pminprematuritypercentage:'',
      pmaxprematuritypercentage:'',
      pprematurityperiodtype:'',
      pPercentage:''
          })
    this.Griddata=[];
    this.ValidateLockinperiod();
  }
  ValidateLockinperiod(){
    debugger;
    this.FdLoanfacilityerrors.pprematurityperiodtype='';
    this.FdLoanfacilityerrors.pPercentage='';
    this.FdLoanfacilityerrors.pmaxprematuritypercentage='';
    this.FdLoanfacilityerrors.pminprematuritypercentage='';
     if(this.fdloanfacilityform.controls.pIsprematuretylockingperiod.value==true)
    {
      this.islockin=true
      this.islockintest=true;
       this.fdloanfacilityform.controls.pPrematuretyageperiod.setValidators(Validators.required);
      this.fdloanfacilityform.controls.pPrematuretyageperiodtype.setValidators(Validators.required);

            this.fdloanfacilityform.controls.pPrematuretyageperiod.updateValueAndValidity();
       this.fdloanfacilityform.controls.pPrematuretyageperiodtype.updateValueAndValidity();
    }
    else{
      this.islockin=false;
      this.islockintest=false;
      this.fdloanfacilityform.controls.pPrematuretyageperiod.clearValidators();
      this.fdloanfacilityform.controls.pPrematuretyageperiodtype.clearValidators();
    
      this.fdloanfacilityform.controls.pPrematuretyageperiod.updateValueAndValidity();
       this.fdloanfacilityform.controls.pPrematuretyageperiodtype.updateValueAndValidity();
    }
      this.BlurEventAllControll(this.fdloanfacilityform);
  }
  Latefeeapplicable()
  {
    debugger;
    this.forFixed=true;
    this.forPercentage=false;
    this.fdloanfacilityform.patchValue({
      pLatefeepaybletype: 'comfixed',
      pLatefeepayblevalue: '',
       pLatefeeapplicabletype:'Days',
      pLatefeeapplicablefrom:'0'
    })
    this.FdLoanfacilityerrors.pLatefeepayblevalue='';
    this.FdLoanfacilityerrors.pLatefeeapplicablefrom='';
    this.FdLoanfacilityerrors.pLatefeeapplicabletype='';
  this.ValidateLateFeeApplicable();
  }
ValidateLateFeeApplicable(){
  debugger;
    if(this.fdloanfacilityform.controls.pIslatefeepayble.value==true)
    {
      this.islatefeeapplicable=true;
       this.fdloanfacilityform.controls.pLatefeepayblevalue.setValidators(Validators.required);
      this.fdloanfacilityform.controls.pLatefeeapplicablefrom.setValidators(Validators.required);
      this.fdloanfacilityform.controls.pLatefeeapplicabletype.setValidators(Validators.required);

      this.fdloanfacilityform.controls.pLatefeepayblevalue.updateValueAndValidity();
      this.fdloanfacilityform.controls.pLatefeeapplicablefrom.updateValueAndValidity();
      this.fdloanfacilityform.controls.pLatefeeapplicabletype.updateValueAndValidity();
    }
    else{
      this.islatefeeapplicable=false;
       this.fdloanfacilityform.controls.pLatefeepayblevalue.clearValidators();
      this.fdloanfacilityform.controls.pLatefeeapplicablefrom.clearValidators();
      this.fdloanfacilityform.controls.pLatefeeapplicabletype.clearValidators();

      this.fdloanfacilityform.controls.pLatefeepayblevalue.updateValueAndValidity();
      this.fdloanfacilityform.controls.pLatefeeapplicablefrom.updateValueAndValidity();
      this.fdloanfacilityform.controls.pLatefeeapplicabletype.updateValueAndValidity();
    }
         this.BlurEventAllControll(this.fdloanfacilityform);
}
  latefeePayablechange(type) {
    if(type == 'fixed') {
      this.forFixed = true;
      this.forPercentage = false;
      this.fdloanfacilityform.patchValue({
        pLatefeepayblevalue: ''
      })
    }
    else {
      this.forFixed = false;
      this.forPercentage = true;
      this.fdloanfacilityform.patchValue({
        pLatefeepayblevalue: ''
      })
    }
      this.FdLoanfacilityerrors.pLatefeepayblevalue='';
  }
  Period_Change(textboxname){
    debugger;
    let Noofdays;
    let convertiondays;
    let period;
    let periodtype;
    if(Number(this.maxinvestmentperiodto)>0){
     if(textboxname=='Age'){
     period=this.fdloanfacilityform.controls.pAgeperiod.value;
     periodtype=this.fdloanfacilityform.controls.pAgeperiodtype.value;
     }
     else if(textboxname=='Lockin'){
    period=this.fdloanfacilityform.controls.pPrematuretyageperiod.value;
    periodtype=this.fdloanfacilityform.controls.pPrematuretyageperiodtype.value;
     }
     else if(textboxname=='To'){
    period=this.fdloanfacilityform.controls._FixedDepositPrematurityInterestPercentages['controls'].pmaxprematuritypercentage.value;
    periodtype=this.fdloanfacilityform.controls._FixedDepositPrematurityInterestPercentages['controls'].pprematurityperiodtype.value;
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
        this._CommonService.showWarningMessage('Age of Advance for Availing loan must be less than or equal to Max investment Period ('+convertiondays+' '+ periodtype +')');
        this.fdloanfacilityform.controls.pAgeperiod.setValue('');
         this.fdloanfacilityform.controls.pAgeperiodtype.setValue('Days');
        return;
        }
        else if(textboxname=='Lockin'){
        this._CommonService.showWarningMessage('Lockin Period must be less than or equal to Max investment Period ('+convertiondays+' '+ periodtype +')');
        this.fdloanfacilityform.controls.pPrematuretyageperiod.setValue('');
         this.fdloanfacilityform.controls.pPrematuretyageperiodtype.setValue('Days');
        return;
        }
         else if(textboxname=='To'){
        this._CommonService.showWarningMessage('Pre-Mature To must be less than or equal to Max investment Period ('+convertiondays+' '+ periodtype +')');
        this.fdloanfacilityform.controls._FixedDepositPrematurityInterestPercentages['controls'].pmaxprematuritypercentage.setValue("");
        this.fdloanfacilityform.controls._FixedDepositPrematurityInterestPercentages['controls'].pprematurityperiodtype.setValue('Days');

        return;
        }
      }
    }
    }

  }
  Validaations(type){
    const Loanfacilitycontrols = <FormGroup>this.fdloanfacilityform.controls['_FixedDepositPrematurityInterestPercentages'];
    if(type=='ADD'){
      Loanfacilitycontrols.controls.pminprematuritypercentage.setValidators(Validators.required)
      Loanfacilitycontrols.controls.pmaxprematuritypercentage.setValidators(Validators.required)
      Loanfacilitycontrols.controls.pPercentage.setValidators(Validators.required)
      Loanfacilitycontrols.controls.pprematurityperiodtype.setValidators(Validators.required)

    }
    else{
      Loanfacilitycontrols.controls.pminprematuritypercentage.clearValidators();
      Loanfacilitycontrols.controls.pmaxprematuritypercentage.clearValidators();
      Loanfacilitycontrols.controls.pPercentage.clearValidators();
      Loanfacilitycontrols.controls.pprematurityperiodtype.clearValidators();
    }
     Loanfacilitycontrols.controls.pminprematuritypercentage.updateValueAndValidity();
      Loanfacilitycontrols.controls.pmaxprematuritypercentage.updateValueAndValidity();
      Loanfacilitycontrols.controls.pPercentage.updateValueAndValidity();
      Loanfacilitycontrols.controls.pprematurityperiodtype.updateValueAndValidity();
      this.BlurEventAllControll(Loanfacilitycontrols);
  }
  Addtogrid()
  {
    debugger
    let isValid=true;
    let isloanfacilityValid = true;
    const Loanfacilitycontrols = <FormGroup>this.fdloanfacilityform.controls['_FixedDepositPrematurityInterestPercentages'];
     this.Validaations('ADD');
    isloanfacilityValid = this.checkValidations(Loanfacilitycontrols, isloanfacilityValid);
    if(isloanfacilityValid)
    {
      if(this.ValidateGridData())
      {
        if(parseFloat(this.maxInterestrateto)>0){
        let newpercentage=parseFloat( this.fdloanfacilityform['controls']['_FixedDepositPrematurityInterestPercentages']['controls']['pPercentage'].value)
        if(newpercentage>parseFloat(this.maxInterestrateto)){
          this._CommonService.showWarningMessage('Percentage must be less than or equal to Max interest Rate ('+ this.maxInterestrateto + ')');
           this.fdloanfacilityform['controls']['_FixedDepositPrematurityInterestPercentages']['controls']['pPercentage'].setValue("");
           return;
        }
        }
       this.Griddata.push(this.fdloanfacilityform.controls._FixedDepositPrematurityInterestPercentages.value)
       this.fdloanfacilityform['controls']['_FixedDepositPrematurityInterestPercentages']['controls']['pminprematuritypercentage'].setValue("")
       this.fdloanfacilityform['controls']['_FixedDepositPrematurityInterestPercentages']['controls']['pmaxprematuritypercentage'].setValue("")
       this.fdloanfacilityform['controls']['_FixedDepositPrematurityInterestPercentages']['controls']['pPercentage'].setValue("")
       this.fdloanfacilityform['controls']['_FixedDepositPrematurityInterestPercentages']['controls']['pprematurityperiodtype'].setValue("")
        this.Validaations('REMOVE');
       this.FdLoanfacilityerrors={}
      }
      else{
           this._CommonService.showWarningMessage(this.ermsg)
          
      }
      
    }
     
    this.percentageto="";
    this.percentagefrom=""
     console.log(this.fdloanfacilityform.value);
     
  }
  prematuretypeselected(event)
  {
   debugger
   this.days=event.target.value;
   this.Period_Change('To');
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
        this.fdloanfacilityform.controls._FixedDepositPrematurityInterestPercentages['controls'].pminprematuritypercentage.setValue("")
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
        this.fdloanfacilityform.controls._FixedDepositPrematurityInterestPercentages['controls'].pmaxprematuritypercentage.setValue("")
      }
      else{
        this.Period_Change('To');
      }
    }
   
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
    if (this.fdloanfacilityform.controls._FixedDepositPrematurityInterestPercentages.value.pminprematuritypercentage != null)
    from =this.fdloanfacilityform.controls._FixedDepositPrematurityInterestPercentages.value.pminprematuritypercentage;
    if (this.fdloanfacilityform.controls._FixedDepositPrematurityInterestPercentages.value.pmaxprematuritypercentage != null)
    to =this.fdloanfacilityform.controls._FixedDepositPrematurityInterestPercentages.value.pmaxprematuritypercentage;

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
  
  
  
            if (this.fdloanfacilityform.controls._FixedDepositPrematurityInterestPercentages.value.pprematurityperiodtype == data[i].pprematurityperiodtype)
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
  removeHandler(event) {
    this.Griddata.splice(event.rowIndex, 1);
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
          this.FdLoanfacilityerrors[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._CommonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.FdLoanfacilityerrors[key] += errormessage + ' ';
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
  
}

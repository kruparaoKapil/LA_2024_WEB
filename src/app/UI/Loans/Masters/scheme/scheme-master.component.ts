import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, MaxLengthValidator } from '@angular/forms';
import { SchememasterService } from 'src/app/Services/Loans/Masters/schememaster.service';
import { DatePipe, JsonPipe } from '@angular/common'
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../Services/common.service';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { debug } from 'util';
import { isEmpty } from 'rxjs-compat/operator/isEmpty';

declare let $: any

@Component({
  selector: 'app-scheme-master',
  templateUrl: './scheme-master.component.html',
  styles: []
})
export class SchemeMasterComponent implements OnInit {
  editinfo: any;
  todate = false;
  public loading = false;
  schemename: any;
  hideandshowtype = false;
  buttonname = "Save";
  sc1:any;
  sc2:any;
  sc3:any;
  Mincharge:any;
  Maxcharge:any;
  SchemeIntrestgrid:any=[]
  Schemechargesgrid:any=[]
  schemecode: any;
  disableloanname = false;
  dataBind;
  recordid: any;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  constructor(private router: Router,private zone: NgZone, private _CommonService: CommonService, private toaster: ToastrService, private fb: FormBuilder, private _schememasterservice: SchememasterService, public datepipe: DatePipe) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.showWeekNumbers = false;
    this.dpConfig.minDate = new Date();
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY';

    

  }   


  schemeform: FormGroup
  schememasterdata: any;
  submitted = false;
  public disablesavebutton = false;

  loantypeid: any = [];
  
  loantype: any = [];
  loanname: any = [];
  loanid: any = [];
  
  schememaster: any = [];
  schemeinterest: any = [];
  schemecharges: any = [];
  Commissionpayout: any;
  Schemecommissionpayouttype: any;
  Isreferralcomexist: any;
  Commissionpayouttype: any;
  schemecongigurationdata: any;
  schemeReferralCommissioLoanList: any = [];
  griddata: any
  grddata: any
  showSchemecommissionpayouttypeChange = true;
  rowdata: any
  newform: any;
  checkedtype: any
  buttontype: any;
  ngOnInit() {
    

    this.newform = false;
    this.griddata = []
    this.schemecongigurationdata = []
    this.schemeform = this.fb.group({
      pSchemename: ['', [Validators.required,Validators.maxLength(75)]],
      pSchemecode: ['', [Validators.required,Validators.maxLength(25)]],
      pLoantype: ['', Validators.required],
      pLoanNmae: [''],
      pSchemeinterest: [''],
      pCreatedby: this._CommonService.pCreatedby,
      pSchemeid: ['0'],
      pStatusname: ['Active'],
      pCommissionpayout: [''],
      pSchemecommissionpayouttype: ['Percentage'],
      pIsreferralcomexist: [''],
      pCommissionpayouttype: [''],
      pSchemecommissionpayout: [''],
      pEffectfromdate: ['', Validators.required],
      pEffecttodate: ['', Validators.required],
      pLoanid: ['', Validators.required],
      pLoantypeid: [''],

      schemeReferralCommissioLoanList: this.fb.array([
        // this.addschemeReferralCommissioLoanList()
      ]),

      schemeConfigurationList: this.fb.array([
        // this. addSchemeConfigurationList()
      ]),
      schemechargesconfigList: this.fb.array([
        // this.addschemeConfigurationChargesList()
      ]),

    });

    this.buttontype = this._schememasterservice.newstatus();
    //console.log(this.buttontype)

    if (this.buttontype == "edit") {

      this.recordid = this._schememasterservice.sendrecordid();
      this.editinfo = this._schememasterservice.getEditInformation();
      if (this.editinfo != null) {

        this.buttonname = "Update";
        this.disableloanname = true;

        let Referralcontrol = <FormArray>this.schemeform.controls['schemeReferralCommissioLoanList'];
        Referralcontrol.push(this.addschemeReferralCommissioLoanList());
        this.schemeform.controls['pSchemename'].disable();
        this.schemeform.controls['pSchemecode'].disable();
        this.schemeform.controls['pLoantype'].disable();
        this.schemeform.controls['pLoanNmae'].disable();
        this.loading = true;
        this._schememasterservice.getDataToBind(this.editinfo).subscribe(data => {

          this.loading = false;
          this.dataBind = data;
        
         
          this.SchemeIntrestgrid=this.dataBind.schemeConfigurationList

          this.Schemechargesgrid=this.dataBind.schemechargesconfigList

          this.Commissionpayout = this.dataBind.schemeReferralCommissioLoanList[0].pCommissionpayout
          this.Commissionpayouttype = this.dataBind.schemeReferralCommissioLoanList[0].pCommissionpayouttype
          this.Isreferralcomexist = this.dataBind.schemeReferralCommissioLoanList[0].pIsreferralcomexist
          this.schemeform.controls['pSchemename'].setValue(this.dataBind.pSchemename)
          this.schemeform.controls['pSchemecode'].setValue(this.dataBind.pSchemecode)
          this.schemeform.controls['pSchemeid'].setValue(this.dataBind.pSchemeid)


          this.schemeform.controls['pEffectfromdate'].setValue(this._CommonService.formatDateFromDDMMYYYY(this.dataBind.pEffectfromdate))
          this.schemeform.controls['pEffecttodate'].setValue(this._CommonService.formatDateFromDDMMYYYY(this.dataBind.pEffecttodate))
          this._schememasterservice.getLoanNames(this.dataBind.pLoantypeid).subscribe(data => {

            this.loanname = data;
            this.schemeform.controls['pLoanid'].setValue(this.dataBind.pLoanid)
            this.schemeform.controls['pLoantypeid'].setValue(this.dataBind.pLoantypeid)
          })

          let a = this.loanname

          //const control=<FormArray>this.schemeform.controls['schemeReferralCommissioLoanList']

          //control.push(this.addschemeReferralCommissioLoanList())
          if (this.dataBind.schemeReferralCommissioLoanList[0].pIsreferralcomexist == true) {
            this.hideandshowtype = true
            if (this.dataBind.schemeReferralCommissioLoanList[0].pSchemecommissionpayouttype == "Percentage") {
              //$("#rdpercentage").prop("checked", true); 
              this.checkedtype = "Percentage"
              this.schemeform['controls']['pSchemecommissionpayout'].setValue(this.dataBind.schemeReferralCommissioLoanList[0].pSchemecommissionpayout);
              this.schemeform['controls']['pSchemecommissionpayouttype'].setValue(this.dataBind.schemeReferralCommissioLoanList[0].pSchemecommissionpayouttype);
              this.schemeform.controls.pSchemecommissionpayouttype.setValue("Percentage");
            }
            else {
              this.checkedtype = "Fixed"
              // $("#rdfixed").prop("checked", true);
              this.showSchemecommissionpayouttypeChange = false;
              this.schemeform['controls']['pSchemecommissionpayout'].setValue(this.dataBind.schemeReferralCommissioLoanList[0].pSchemecommissionpayout);
              this.schemeform['controls']['pSchemecommissionpayoutype'].setValue(this.dataBind.schemeReferralCommissioLoanList[0].pSchemecommissionpayouttype);
              this.schemeform.controls.pSchemecommissionpayouttype.setValue("Fixed");

            }

          }

          this.schemecommissionpayouttypeChange();
          this.loading = false;
        })
      }
    }

    this._schememasterservice.getLoanTypes().subscribe(data => {
      this.loantype = data;
    })



  }
  addschemeReferralCommissioLoanList() {
    return this.fb.group({
      pCommissionpayout: [''],
      pSchemecommissionpayouttype: [''],
      pIsreferralcomexist: [''],
      pCommissionpayouttype: [''],
      pSchemecommissionpayout: [''],
      pEffectfromdate: [''],
      pEffecttodate: [''],
      pLoanid: [''],
      pRecordid: ['0'],
      pLoantypeid: [''],
      pCreatedby: [this._CommonService.pCreatedby]
    })
  }

  addSchemeConfigurationList() {
    return this.fb.group({
      pApplicanttype: [''],
      pLoanpayin: [''],
      pInteresttype: [''],
      pActualrateofinterest: [''],
      pMinloanamount: [''],
      // pCreatedby: [this._CommonService.pCreatedby],
      pMaxloanamount: [''],
      pTenurefrom: [''],
      pTenureto: [''],
      pSchemeinterest: [''],
      pLoanid: [''],
      pEffectfromdate: [''],
      pEffecttodate: [''],
      pLoantypeid: [''],

    })
  }
  addschemeConfigurationChargesList() {
    return this.fb.group({
      pChargename: [''],
      pmaxloanamountortenure: [''],
      pminloanamountortenure: [''],
      pmaxchargesvalue: [''],
      pminchargesvalue: [''],
      pchargepercentage: [''],
      pLoanid: [''],
      pEffectfromdate: [''],
      pEffecttodate: [''],
      //   pCreatedby: [this._CommonService.pCreatedby],
      pLoantypeid: [''],
    })
  }   
      SchemeInsrstChanged(event,dataItem,rowIndex)
      {
        debugger;
       
        dataItem.pSchemeinterest=event.target.value
             
      }
      schemechargeschanged(event,dataItem,rowIndex)
      {
         debugger;
         console.log(event.dataItem)
         dataItem.pschemechargespercentage=event.target.value
     
         this.Schemechargesgrid[rowIndex].pSchememinchargesvalue =(dataItem.pschemechargespercentage*dataItem.pminloanamountortenure)/100
         this.Schemechargesgrid[rowIndex].pSchememaxchargesvalue =( dataItem.pschemechargespercentage*dataItem.pmaxloanamountortenure)/100
         
      }
      changeschememinvalue(event,dataItem,rowIndex)
      {
        debugger
       dataItem.pSchememinchargesvalue=event.target.value
       //event.target.value=dataItem.pSchememinchargesvalue
        // if(event.target.value<dataItem.pSchememinchargesvalue || event.target.value>dataItem.pSchememaxchargesvalue)
        // {

        //   this._CommonService.showWarningMessage("Please enter a valid value")
        //   event.target.value=dataItem.pSchememinchargesvalue
        //   this.Schemechargesgrid[rowIndex].pSchememinchargesvalue=dataItem.pSchememinchargesvalue;
        
        // }
      
         
       
      }
      schemechargesmax(event,dataItem,rowIndex)
      {
        debugger
       // dataItem.pSchememaxchargesvalue=event.target.value
        //event.target.value=dataItem.pSchememaxchargesvalue
         // dataItem.pSchememaxchargesvalue=event.target.value
         if(event.target.value>dataItem.pSchememaxchargesvalue || event.target.value<dataItem.pSchememinchargesvalue)
         {
           this._CommonService.showWarningMessage("Please enter a valid value");
           event.target.value=dataItem.pSchememaxchargesvalue
           this.Schemechargesgrid[rowIndex].pSchememaxchargesvalue=dataItem.pSchememaxchargesvalue;
         }
         else{
           this.Schemechargesgrid[rowIndex].pSchememaxchargesvalue=event.target.value
         }
       
      }
      schemechargesmin(event,dataItem,rowIndex)
      {
        debugger
       //dataItem.pSchememinchargesvalue=event.target.value
        //event.target.value=dataItem.pSchememinchargesvalue
          //dataItem.pSchememinchargesvalue=event.target.value
         if(event.target.value<dataItem.pSchememinchargesvalue || event.target.value>dataItem.pSchememaxchargesvalue)
         {
           this._CommonService.showWarningMessage("Please enter a valid value");
           event.target.value=dataItem.pSchememinchargesvalue
           this.Schemechargesgrid[rowIndex].pSchememinchargesvalue=dataItem.pSchememinchargesvalue;
         }
         else{
           this.Schemechargesgrid[rowIndex].pSchememinchargesvalue=event.target.value
         }
      }
      changeschememaxvalue(event,dataItem,rowIndex)
      {
        debugger
      
        this.Schemechargesgrid[rowIndex].pSchememinchargesvalue=event.target.value
        this.Schemechargesgrid[rowIndex].pSchememaxchargesvalue=event.target.value
      }
  loanidforloanname(event) {
   
    this.loantypeid = event.target.value
    const Chargename = event.target.options[event.target.selectedIndex].text;
    this.schemeform['controls']['pLoantype'].setValue(Chargename);


    this._schememasterservice.getLoanNames(this.loantypeid).subscribe(data => {

      this.loanname = data;

    })
   
  }
  clear() {
    

    // this._schememasterservice.newformstatus("new")
    this.schemeform.controls['pSchemename'].enable();
    this.schemeform.controls['pSchemecode'].enable();
    this.schemeform.controls['pLoantype'].enable();
    this.schemeform.controls['pLoanNmae'].enable();
    this.disableloanname = false;
    this.Commissionpayouttype = "";
    this.Commissionpayout = "";
    this.Isreferralcomexist = ""
    this.buttonname = "Save"
    //   this.ngOnInit();
    this.schemeform.reset()
    $('#schemecharges').DataTable().clear().draw();
    $('#schemeInterest').DataTable().clear().draw();


  }
  validatedatepicker(): boolean {
    
    let isValid = true;
    let from_date = this.schemeform.value['pEffectfromdate']
    let to_date = this.schemeform.value['pEffecttodate']
    if (from_date > to_date) {
      this.todate = true;
      isValid = false;
    }
    else {
      this.todate = false;
    }

    return isValid
  }

  save() {
    debugger
    this.submitted = true;
    //console.log(this.schemeform.getRawValue())

    if (this.validatedatepicker()) {
      if (this.schemeform.valid == true)
       {
        try {
         

          //  this.schemeform.controls['pEffectfromdate'].setValue(this.datepipe.transform(this.schemeform.value["pEffectfromdate"], 'MM-dd-yyyy'));
          //   this.schemeform.controls['pEffecttodate'].setValue(this.datepipe.transform(this.schemeform.value["pEffecttodate"], 'MM-dd-yyyy'));
          this.schemeform.value["schemeReferralCommissioLoanList"][0]["pSchemecommissionpayout"] = this.schemeform.value["pSchemecommissionpayout"];
          this.schemeform.value["schemeReferralCommissioLoanList"][0]["pSchemecommissionpayouttype"] = this.schemeform.value["pSchemecommissionpayouttype"]
          this.schemeform.value["schemeReferralCommissioLoanList"][0]["pLoanid"] = this.schemeform.value["pLoanid"];
          this.schemeform.value["schemeReferralCommissioLoanList"][0]["pLoantypeid"] = this.schemeform.value["pLoantypeid"]
          this.schemeform.value['schemeReferralCommissioLoanList'][0]['pEffectfromdate'] = this.schemeform.value['pEffectfromdate']
          this.schemeform.value['schemeReferralCommissioLoanList'][0]['pEffecttodate'] = this.schemeform.value['pEffecttodate']

          this.schemeform.controls['pSchemecode'].setValue(this.schemecode)

        
          this.SchemeIntrestgrid.filter(item => {
            item.pCreatedby = this._CommonService.pCreatedby
            item.pEffectfromdate=this.schemeform.value['pEffectfromdate']
            item.pEffecttodate=this.schemeform.value['pEffecttodate']
            
          })
          this.Schemechargesgrid.filter(item => {
            item.pCreatedby = this._CommonService.pCreatedby
            item.pEffectfromdate=this.schemeform.value['pEffectfromdate']
            item.pEffecttodate=this.schemeform.value['pEffecttodate']
          })
          
          this.schemeform.value['schemeConfigurationList'] = this.SchemeIntrestgrid;
          this.schemeform.value['schemechargesconfigList'] =this.Schemechargesgrid
           this.disablesavebutton = true;
          this.buttonname = 'Processing';

          let data = JSON.stringify(this.schemeform.value);
          //console.log(this.schemeform.value)
          //console.log(this.schemeform.value)
          if (this.buttontype == "new") {
            //this.schemeform.value["schemeReferralCommissioLoanList"][0]["pRecordid"].setValue(0)
            this._schememasterservice.CheckDuplicateSchemeNames(this.schemename).subscribe(duplicatedata => {
              if (duplicatedata == 0) {
                this._schememasterservice.saveschememaster(data).subscribe(saveddata => {
                  if (saveddata) {
                    this.disablesavebutton = false;
                    this.buttonname = 'Save';
                    this.submitted = false;
                    this.schemeform.reset();
                    this.Commissionpayouttype = "";
                    this.Commissionpayout = "";
                    this.Isreferralcomexist = ""
                    this.toaster.success("Saved Successfully", 'Success');
                    this.router.navigateByUrl("/SchemeView")
                    $('#schemecharges').DataTable().clear().draw();
                    $('#schemeInterest').DataTable().clear().draw();
                  }

                  // // this.CalschemeinterestDataTable([]);
                  // // this.CalschemeinterestDataTable([]);
                },
                (error) => {
                  this._CommonService.showErrorMessage(error);
                  this.disablesavebutton = false;
                    this.buttonname = 'Save';
              })

              }
              else {
                this.toaster.info("Scheme Name Exists", 'Info');
                this.schemeform.controls.pSchemename.setValue('');
              }
            })

          }
          if (this.buttontype == "edit") {
            this.schemeform.value["schemeReferralCommissioLoanList"][0]["pSchemecommissionpayout"] = this.schemeform.value["pSchemecommissionpayout"];
            this.schemeform.value["schemeReferralCommissioLoanList"][0]["pSchemecommissionpayouttype"] = this.schemeform.value["pSchemecommissionpayouttype"]
            this.schemeform.value["schemeReferralCommissioLoanList"][0]["pLoanid"] = this.schemeform.value["pLoanid"];
            this.schemeform.value["schemeReferralCommissioLoanList"][0]["pLoantypeid"] = this.schemeform.value["pLoantypeid"];
            this.schemeform.value["schemeReferralCommissioLoanList"][0]['pCommissionpayout'] = this.dataBind.schemeReferralCommissioLoanList[0].pCommissionpayout
            this.schemeform.value["schemeReferralCommissioLoanList"][0]['pCommissionpayouttype'] = this.dataBind.schemeReferralCommissioLoanList[0].pCommissionpayouttype
            this.schemeform.value["schemeReferralCommissioLoanList"][0]['pIsreferralcomexist'] = this.dataBind.schemeReferralCommissioLoanList[0].pIsreferralcomexist
            this.schemeform.value["schemeReferralCommissioLoanList"][0]['pRecordid'] = this.recordid;
            let json = JSON.stringify(this.schemeform.value)
            //console.log(this.schemeform.value)
            this._schememasterservice.updateschememaster(json).subscribe(saveddata => 
              {
               
              this.disablesavebutton = false;
              this.buttonname = 'update';
              this.submitted = false;
              this.schemeform.reset();
              this.Commissionpayouttype = "";
              this.Commissionpayout = "";
              this.Isreferralcomexist = ""
              this.toaster.success("Updated Successfully", 'Success');
              this.router.navigateByUrl("/SchemeView")
              $('#schemecharges').DataTable().clear().draw();
              $('#schemeInterest').DataTable().clear().draw();
              // this.CalschemeinterestDataTable([]);
              // this.CalschemeinterestDataTable([]);
            },
            (error) => {
              this._CommonService.showErrorMessage(error);
              this.disablesavebutton = false;
                this.buttonname = 'update';
          })
          }

        }
        catch (e) {
          alert(e);
          this.disablesavebutton = false;
          
        }
      }
      else{
        this.disablesavebutton = false;
        this.buttonname = 'Save';
      }
    }


  }



  checkschemenameduplicates(event) {

    this.schemename = event.target.value

  }
  checkschemecodeduplicates(event) {
    
    this.schemecode = (event.target.value).toUpperCase();
    //console.log(this.schemecode)
    this._schememasterservice.CheckDuplicateSchemeCodes(this.schemecode).subscribe(duplicatedata => {
      if (duplicatedata
        > 0) {
        this.toaster.info("Scheme code Exists", 'Info');
        this.schemeform.controls.pSchemecode.setValue('');
      }

    })
  }
  schemecommissionpayouttypeChange() {
    
    let payouttype = this.schemeform.controls.pSchemecommissionpayouttype.value;

    if (payouttype == 'Percentage') {
      this.showSchemecommissionpayouttypeChange = true;
      if (this.schemeform['controls']['pSchemecommissionpayout'].value != "") {
        this.schemeform['controls']['pSchemecommissionpayout'].setValue(this.Commissionpayout)
      }
      this.schemeform['controls']['pSchemecommissionpayout'].setValue("")

      if (this.buttonname == "Update") {
        if (this.dataBind.schemeReferralCommissioLoanList[0].pSchemecommissionpayouttype == "Percentage") {
          this.schemeform['controls']['pSchemecommissionpayout'].setValue(this.dataBind.schemeReferralCommissioLoanList[0].pSchemecommissionpayout);
        }
        else {
          this.schemeform['controls']['pSchemecommissionpayout'].setValue("")
        }
      }
    }
    else {

      this.showSchemecommissionpayouttypeChange = false;
      if (this.buttonname == "Save") {
        if (this.schemeform['controls']['pSchemecommissionpayout'].value != "") {
          this.schemeform['controls']['pSchemecommissionpayout'].setValue(this.Commissionpayout)
        }
        this.schemeform['controls']['pSchemecommissionpayout'].setValue("")

      }
      if (this.buttonname == "Update") {
        if (this.dataBind.schemeReferralCommissioLoanList[0].pSchemecommissionpayouttype == "Fixed") {
          this.schemeform['controls']['pSchemecommissionpayout'].setValue(this.dataBind.schemeReferralCommissioLoanList[0].pSchemecommissionpayout);
        }
        else {
          this.schemeform['controls']['pSchemecommissionpayout'].setValue("")
        }
      }
    }

  }

  getloanspeific(event) {

debugger
    
    this.loanid = event.target.value;
    let Referralcontrol = <FormArray>this.schemeform.controls['schemeReferralCommissioLoanList'];
    Referralcontrol.push(this.addschemeReferralCommissioLoanList());
    // this.schemeform['controls']['schemeReferralCommissioLoanList']['controls'][0].patchValue(this.schemeform.value);
    this._schememasterservice.getLoanspecificSchemeMasterDetails(this.loanid).subscribe(data => {
      debugger
      this.schememaster = data;
      //console.log(this.schememaster)
      for (let i = 0; i < this.schememaster.length; i++) {
        this.schemeinterest = this.schememaster[i].schemeConfigurationList;
        //console.log(this.schemeinterest)
       
        this.SchemeIntrestgrid=this.schemeinterest;
       
        this.schemecharges = this.schememaster[i].schemechargesconfigList;
        //console.log( this.schemecharges )
        this.Schemechargesgrid=this.schemecharges
      
        this.schemeReferralCommissioLoanList = this.schememaster[i].schemeReferralCommissioLoanList;

        for (let j = 0; j < this.schemeReferralCommissioLoanList.length; j++) {
          // console.log(this.schemeReferralCommissioLoanList)
          this.schemeform['controls']['schemeReferralCommissioLoanList']['controls'][0]['controls']['pCommissionpayout'].setValue(this.schemeReferralCommissioLoanList[j].pCommissionpayout)
          this.Commissionpayout = this.schemeReferralCommissioLoanList[j].pCommissionpayout
          this.schemeform['controls']['schemeReferralCommissioLoanList']['controls'][0]['controls']['pCommissionpayouttype'].setValue(this.schemeReferralCommissioLoanList[j].pCommissionpayouttype)
          this.Commissionpayouttype = this.schemeReferralCommissioLoanList[j].pCommissionpayouttype
          this.schemeform['controls']['schemeReferralCommissioLoanList']['controls'][0]['controls']['pIsreferralcomexist'].setValue(this.schemeReferralCommissioLoanList[j].pIsreferralcomexist)
          this.Isreferralcomexist = this.schemeReferralCommissioLoanList[j].pIsreferralcomexist;
          if (this.Isreferralcomexist == true) {
            this.hideandshowtype = true;
            if (this.schemeReferralCommissioLoanList[j].pCommissionpayouttype == "Fixed") {
              this.showSchemecommissionpayouttypeChange = false;
              // $("#rdfixed").prop("checked", true);
              this.checkedtype = "Fixed"
              this.schemeform['controls']['pSchemecommissionpayouttype'].setValue(this.schemeReferralCommissioLoanList[j].pCommissionpayouttype);
              this.schemeform['controls']['pSchemecommissionpayout'].setValue(this.schemeReferralCommissioLoanList[j].pCommissionpayout);
            }
            else {
              // $("#rdpercentage").prop("checked", true);  
              this.checkedtype = "Percentage"
              this.showSchemecommissionpayouttypeChange = true;
              this.schemeform['controls']['pSchemecommissionpayouttype'].setValue(this.schemeReferralCommissioLoanList[j].pCommissionpayouttype);
              this.schemeform['controls']['pSchemecommissionpayout'].setValue(this.schemeReferralCommissioLoanList[j].pCommissionpayout);
            }
          }
          else {
            this.hideandshowtype = false
          }

        }

      }
    })

  }
}

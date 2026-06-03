import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AccountingTransactionsService } from 'src/app/Services/Accounting/accounting-transactions.service';
import { CommonService } from 'src/app/Services/common.service';
@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styles: []
})

export class SubCategoryComponent implements OnInit {
  SubcategoryForm:FormGroup;
  Subcategorydata:any=[];
  griddata:any=[];
  constructor(private FB:FormBuilder, private commonservice:CommonService,private _AccountingTransactionsService: AccountingTransactionsService) { }

  ngOnInit() {
    this.SubcategoryForm = this.FB.group({
      pAccountHeads:[''],
      pSubCategory:[''],
    });
    this.GetTwotypeAccountHeads();
  }
  GetTwotypeAccountHeads(){
    this._AccountingTransactionsService.GetTwotypeAccountHeads().subscribe(res=>{
      this.Subcategorydata = res;
    })
  }
  AccountHeads(event){
    debugger
    
    this._AccountingTransactionsService.GetthreetypeAccountHeads(event.pACCOUNTID).subscribe(json=>{
      this.griddata=json
    })
    this._AccountingTransactionsService.Gettwotypetotaltransactionscount(event.pACCOUNTID).subscribe(res=>{
      if(res >0){
        this.commonservice.showWarningMessage('This Account Has Transactions Never Allow To Create Three Type');
        this.SubcategoryForm.controls.pAccountHeads.setValue('');
        return
      }
    })
   
  }
  ChangeSubcategorychange(event){
    debugger
    this._AccountingTransactionsService.Getthreetypeaccountnamecount(this.SubcategoryForm.controls.pAccountHeads.value,
      this.SubcategoryForm.controls.pSubCategory.value
    ).subscribe(res=>{
      if(res >0){
        this.commonservice.showWarningMessage('Already Exists With Save Name');
        this.SubcategoryForm.controls.pSubCategory.setValue('');
        return
      }
    })
  }
  clearsubcategory(){
    debugger
    this.SubcategoryForm = this.FB.group({
  pAccountHeads:[''],
  pSubCategory:[''],
});
this.griddata=[];
  }
  savesubcategory(){
    debugger
    if(this.SubcategoryForm.controls.pAccountHeads.value !='' && this.SubcategoryForm.controls.pSubCategory.value !=''){
      let data = this.SubcategoryForm.value;
      this._AccountingTransactionsService.SavethreetypeSubcategory(this.SubcategoryForm.controls.pSubCategory.value,this.SubcategoryForm.controls.pAccountHeads.value).subscribe(res=>{
        if(res){
          this.commonservice.showInfoMessage('Saved Success');
          this.clearsubcategory()
        }
      })
    }else{
      this.commonservice.showWarningMessage('Please Enter Valid Data');
      return
    }
  }
}

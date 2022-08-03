import { LightningElement,track} from 'lwc';
import getavailableMedicineopenlist from '@salesforce/apex/TwssMedicalHospitalController.getavailableMedicineopenlist';
import getmedicineShortageopenlist from '@salesforce/apex/TwssMedicalHospitalController.getmedicineShortageopenlist';
import getpatientprescriptionlist from '@salesforce/apex/TwssMedicalHospitalController.getpatientprescriptionlist';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const columns = [
    { label: 'name', fieldName: 'Name' },
    { label: 'medicineprice', fieldName: 'Medicines_Price__c' },
    { label: 'totalquantity', fieldName: 'Total_Quantity__c' },
    
];
const shortagecolumns = [
    { label: 'name', fieldName: 'Name' },
    { label: 'medicineprice', fieldName: 'Medicines_Price__c' },
    { label: 'totalquantity', fieldName: 'Total_Quantity__c' },
    { label:'Actions' ,type: "button", typeAttributes: {  
        label: 'Edit',  
        name: 'Edit',  
        title: 'Edit',  
        disabled: false,  
        value: 'edit',  
        iconPosition: 'left'  
    }}  
    
];
export default class AppPharmacyLogin extends LightningElement {
    availableMedicineopen=false;
    medicineShortageopen=false;
    addMedicineopen=false;
    medicineBillopen=false;
    patientprescription=false;
    availableMedicineopenlist=[];
    medicineShortageopenlist=[];
    columns = columns;
    shortagecolumns=shortagecolumns;
    itemname;
    handleonselect(event){
       this.itemname=event.detail.name;


if(this.itemname=='Available medicine'){
  this.availableMedicineopen=true;
  this.medicineShortageopen=false;
  this.addMedicineopen=false;
  this.medicineBillopen=false;
  this.patientprescription=false;
  getavailableMedicineopenlist({}).then(result=>{
    this.availableMedicineopenlist=result;
  })
}else if(this.itemname=='Medicine Shortage'){
    this.availableMedicineopen=false;
    this.medicineShortageopen=true;
    this.addMedicineopen=false;
    this.medicineBillopen=false;
    this.patientprescription=false;
    getmedicineShortageopenlist({}).then(result=>{
        this.medicineShortageopenlist=result;
    })
}else if(this.itemname=='Add Medicine'){
    this.availableMedicineopen=false;
    this.medicineShortageopen=false;
    this.addMedicineopen=true;
    this.medicineBillopen=false;
    this.patientprescription=false;
}else if(this.itemname=='Medicine Bill'){
    this.availableMedicineopen=false;
    this.medicineShortageopen=false;
    this.addMedicineopen=false;
    this.medicineBillopen=true;
    this.patientprescription=false;
}else if(this.itemname=='Patient Prescription'){
    this.availableMedicineopen=false;
    this.medicineShortageopen=false;
    this.addMedicineopen=false;
    this.medicineBillopen=false;
    this.patientprescription=true;
}
}
recId;
callRowAction(event){
    this.recId =  event.detail.row.Id;  
        const actionName = event.detail.action.name;  
        console.log('recId::::'+this.recId);
        console.log('actionName:::'+actionName);
        if(actionName=='Edit'){
            this.updatemedicineshortageOpen=true;
        }
}
updatemedicineshortageOpen=false;
updatemedshartage;
closeupdatemedicineModal(){
this.updatemedicineshortageOpen=false;
}
accountId;
    handleSuccess(event) {
        this.accountId = event.detail.id;
        const event1 = new ShowToastEvent({
            title: 'STATUS',
            message:
                 'UPDATE SUCCESSFULLY!!!!!'
       });
       this.dispatchEvent(event1);
       
       this.updatemedicineshortageOpen=false;
    }

    patientid;
    patientname;
    doctorname;
    patientprescriptiondatatemp=false;
    patientidchange(event){
     this.patientid=event.target.value;
    }
    patientprescriptiondata=[];
    patientsearchClick(){
        getpatientprescriptionlist({patientid:this.patientid}).then(result=>{
            this.patientprescriptiondata=result;
            if(this.patientprescriptiondata.length>0){
                this.patientname=this.patientprescriptiondata[0].Patient_Name__c;
                this.doctorname=this.patientprescriptiondata[0].doctors_name__c;
              this.patientprescriptiondatatemp=true;
            }else{

            }
        })
    }
    recordid;
    Patientprescriptiontemp=false;
    patientprescriptionclick(event){
        this.recordid=event.target.name;
        console.log(';;;;;'+this.recordid);
     this.Patientprescriptiontemp=true;
    }
    patientprecscriptionedit(){
        this.Patientprescriptiontemp=false;
    }

    keyIndex = 0;
    @track item1List = [
        {
            id: 0
        }
    ];

    addRow() {
        ++this.keyIndex;
        var newItem = [{ id: this.keyIndex }];
        this.item1List = this.item1List.concat(newItem);
    }
    removeRow(event) {
        if (this.item1List.length >= 2) {
            this.item1List = this.item1List.filter(function (element) {
                return parseInt(element.id) !== parseInt(event.target.accessKey);
            });
        }
    }

    handleSub() {
        var isVal = true;
        this.template.querySelectorAll('lightning-input-field').forEach(element => {
            isVal = isVal && element.reportValidity();
        });
        if (isVal) {
            this.template.querySelectorAll('lightning-record-edit-form').forEach(element => {
                element.submit();
                this.addMedicineopen=false;
            });
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Medicines Added successfully',
                    variant: 'success',
                }),
            );
            
        } else {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: 'Please enter all the required fields',
                    variant: 'error',
                }),
            );
        }
    }



}
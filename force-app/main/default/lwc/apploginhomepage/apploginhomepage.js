import { LightningElement,track,wire,api } from 'lwc';
//import gettodaypatients from '@salesforce/apex/TwssMedicalHospitalController.gettodaypatients';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import savemedicineform from '@salesforce/apex/TwssMedicalHospitalController.savemedicineform';
import DATE from '@salesforce/schema/Pharmacy__c.Date__c';
import PATIENTNAME from '@salesforce/schema/Pharmacy__c.Patient_Name__c';
import DOCTORNAME from '@salesforce/schema/Pharmacy__c.Doctor_Name__c';
import MEDICINELIST from '@salesforce/schema/Pharmacy__c.Medicine_List__c';
import { refreshApex } from '@salesforce/apex';
import medicinebill from '@salesforce/apex/TwssMedicalHospitalController.medicinebill';
import updatepatientdata from '@salesforce/apex/TwssMedicalHospitalController.updatepatientdata';
import getdoctordetails from '@salesforce/apex/TwssMedicalHospitalController.getdoctordetails';
import searchPatient from '@salesforce/apex/TwssMedicalHospitalController.searchPatient';
import getdoctorappointment from '@salesforce/apex/TwssMedicalHospitalController.getdoctorappointment';
import fromdatefield from '@salesforce/schema/Leave__c.From_Date__c';
import todatefield from '@salesforce/schema/Leave__c.To_Date__c';
import reasonfield from '@salesforce/schema/Leave__c.Reason__c';
import namefield from '@salesforce/schema/Leave__c.Doctor_Name__c';
import insertleavedetailes from '@salesforce/apex/TwssMedicalHospitalController.insertleavemethod';
import updatepwdmethod from '@salesforce/apex/TwssMedicalHospitalController.updatepwdmethod';
import doctorid from '@salesforce/schema/Leave__c.Doctor__c';
const patientdata = [
     { label: 'Id', fieldName: 'Name' },
     { label: 'Appointment Date', fieldName: 'Appointment_Date__c' },
     { label: 'Name', fieldName: 'Name__c' },
     { label: 'Mobile Number', fieldName: 'Mobile_Number__c' },
     { label: 'EmailId', fieldName: 'Email_Id__c'},
     { label: 'Speciality', fieldName: 'Speciality__c'},
     { label: 'Reason', fieldName: 'Write_Reasons__c'},
    
 ];





const actions = [

     { label: 'Medicine form', name: 'Medicine' },
     { label: 'Update Details', name: 'Update Details' },
];

const columns = [
     { label: 'BookAppointment Id', fieldName: 'Name' },
     { label: 'Patient Name', fieldName: 'Name__c' },
     { label: 'Patient Appointmemt Date', fieldName: 'Appointment_Date__c', type: 'date' },
     { label: 'Patient Reason', fieldName: 'Write_Reasons__c' },
     { label: 'Doctor Name', fieldName: 'Doctor__c' },
     {label:'Patient Availability' ,fieldName:'PatientAvailability__c'},
     { label: 'Patient Status', fieldName: 'Patient_Status__c', editable: true, type: 'Picklist' },
     {
          label: 'Action',
          type: 'action',
          typeAttributes: { rowActions: actions },
     },
     
];


const medilcalbillcol = [
     { label: 'Patient Name', fieldName: 'Patient_Name__c' },
     { label: 'Patient medical List', fieldName: 'Patient_medical_List__c' },
     { label: 'Total Amount', fieldName: 'Amount__c' }

]


export default class Apploginhomepage extends NavigationMixin(LightningElement) {

     medicineformdetails = {
          Date__c: DATE,
          Patient_Name__c: PATIENTNAME,
          Doctor_Name__c: DOCTORNAME,
          Medicine_List__c: MEDICINELIST
     }
     columnHeader = ['Patient Name', 'Medicines', 'Amount'];
     medilcalbillcol = medilcalbillcol;
     name = sessionStorage.getItem("name");
     data = [];
     columns = columns;
     errormsg;
     openDatatable = false;
     norecordsfoundtemp = false;
     openmedicineform = false;
     patientName;
     doctorName;
     medicinelist = [];
     todaydate;
     savemedicineformStatus;
     medicinebillStatus;
     openBill = false;
     openUpdateDetails = false;
     appoinmentId;
     appoinmentReson;
     appoinmentDate;
     appoinmentStatus;
     patientSatus;
     updateStatus;
     rowOffset = 0;
     deleterecordsStatus;
     value;
     nameorphoone;
     searchPatientStatus=[];
     patientdata=patientdata;
     openSearchPatientdata=false;
     patientnotavailible=false;
     patientAvailability;
     doctorinfo;
     doctorimg;
     doctorid;
     doctorspecilist;
     doctormobile;
     doctorgender;
     patientinfo;
     doctorusername;
     visibleobject;
     doctorlevtaken;
     doctorremainlevs;
     @wire(getdoctordetails, {doctorname:'$name'})
     wireddoctors({ error ,data }){
     if(data){
      this.doctorinfo=data;
      this.doctorimg=data[0].Photo__c;
      this.doctorid=data[0].Id;
      this.doctorspecilist=data[0].Specialist__c;
      this.doctormobile=data[0].Mobile__c;
      this.doctorgender=data[0].Gender__c;
      this.doctorusername=data[0].Username__c;
      this.doctorlevtaken=data[0].Leaves_Taken__c;
      this.doctorremainlevs=data[0].Reamaining_leaves__c;
      this.error=undefined;      

      console.log('::::::::Photo:::::::::::'+this.doctorimg);
     // getdoctorappointment({doctorname:this.name}).then(result=>{
     //      this.patientinfo=result;
     // })


     }else if(error)
      this.doctorinfo=undefined;
     }
     @api PageSize='5';

     get optionsReSize() {
          return [
              { label: '5', value: '5' },
              { label: '10', value: '10' },
              { label: '20', value: '20' },
          ];
      }
      handleSize(event)
      {
           this.PageSize=event.detail.value;
           console.log(this.PageSize);
      }
     datasize;
 @wire(getdoctorappointment, {doctorname:'$name'})
 wireddocdata({data,error}){
      if(data){
           this.datasize=data.length;
       if(data.length>0){
           this.patientinfo=data;
           this.openDatatable=true;
           this.norecordsfoundtemp=false;
       }
       else
        {
            this.openDatatable=false;
            this.norecordsfoundtemp=true;
            this.errormsg="you don't have any  Pending Appointments!";
            console.log(this.errormsg);
       }
      }
 }

 updateAccountHandler(event){
      this.visibleobject=[...event.detail.records];
 }
     // todaypatients() {
     //      this.openSearchPatientdata=false;
     //      gettodaypatients({ name: this.name }).then(restlt => {
     //           this.data = restlt;

     //           console.log('this.data:::::' + this.data);
     //           console.log('this.data:::1111::' + this.data.length);

     //           if (this.data.length > 0) {
     //                this.norecordsfoundtemp = false;
     //                this.openDatatable = true;
     //           } else {
     //                this.openDatatable = false;
     //                this.norecordsfoundtemp = true;
     //                this.errormsg = "Today you don't have any Appointments yet!!";
     //           }


     //      })
     // }

   

     logout() {
          eval("$A.get('e.force:refreshView').fire();");
          const event = new ShowToastEvent({
               title: 'Thank You',
               message:
                    'Successfully Logged out......!',


          });
          sessionStorage.clear();  
          this.dispatchEvent(event);
          // eval("$A.get('e.force:refreshView').fire();");

          this[NavigationMixin.Navigate]({
               type: 'standard__component',
               attributes: {
                    componentName: 'c__Login_comp'
               },

          });
          // eval("$A.get('e.force:refreshView').fire();");

     }

     handleRowAction(event) {
          var action = event.detail.action;
          var row = event.detail.row.Name__c;

          console.log('action:::' + action.label);
          console.log('row:::' + row);
          this.patientName = event.detail.row.Name__c;
          this.doctorName = event.detail.row.Doctor__c;
          if (action.label == 'Medicine form') {

               this.openmedicineform = true;
               this.openUpdateDetails = false;
          } else if (action.label == 'Update Details') {
               var row = event.detail.row.Name__c;
               console.log(':::::::::::::::::::::' + row);
               this.appoinmentId = event.detail.row.Name;
               this.appoinmentReson = event.detail.row.Write_Reasons__c;

               this.appoinmentDate = event.detail.row.Appointment_Date__c;
               this.appoinmentStatus = event.detail.row.Patient_Status__c;
               this.patientAvailability=event.detail.row.PatientAvailability__c;

               this.openmedicineform = false;
               this.openUpdateDetails = true;

          }

     }

     medicinelistChange(event) {
          this.medicineformdetails.Medicine_List__c = event.target.value;

     }
     dateChange(event) {
          this.medicineformdetails.Date__c = event.target.value;
     }




     submitDetails() {
          this.medicineformdetails.Patient_Name__c = this.patientName;
          this.medicineformdetails.Doctor_Name__c = this.doctorName;
          console.log('this.todaydate' + this.todaydate);
          console.log('this.patientName' + this.patientName);
          console.log('this.doctorName' + this.doctorName);

          console.log(':::data::' + this.medicineformdetails.Medicine_List__c);
          console.log(':::data::' + this.medicineformdetails.Medicine_List__c[1]);



          savemedicineform({ key: this.medicineformdetails }).then(result => {

               this.savemedicineformStatus = result;

               console.log('this.savemedicineformStatus::' + this.savemedicineformStatus);


               if (this.savemedicineformStatus == 'Success') {


                    this.openmedicineform = false;



                    const event = new ShowToastEvent({
                         title: 'STATUS',
                         message:
                              'SENT TO PHARMACY'


                    });
                    this.dispatchEvent(event);

                    medicinebill({ key: this.medicineformdetails.Medicine_List__c }).then(result => {

                         this.medicinebillStatus = result;

                         console.log(' this.medicinebillStatus:::' + this.medicinebillStatus);
                         console.log(' this.medicinebillStatus:1111::' + this.medicinebillStatus[0].Patient_medical_List__c);
                         console.log(' this.medicinebillStatus:::' + this.medicinebillStatus[0].Amount__c);
                         console.log(' this.medicinebillStatus:::' + this.medicinebillStatus[0].Patient_Name__c);

                         this.openBill = true;

                    })


               }

          })



     }


     closeModal() {
          this.openmedicineform = false;
          this.openBill = false;
     }



     downloadbill() {

          // Prepare a html table
          let doc = '<table>';
          // Add styles for the table
          doc += '<style>';
          doc += 'table, th, td {';
          doc += '    border: 1px solid black;';
          doc += '    border-collapse: collapse;';
          doc += '}';
          doc += '</style>';
          // Add all the Table Headers
          doc += '<tr>';
          this.columnHeader.forEach(element => {
               doc += '<th>' + element + '</th>'
          });
          doc += '</tr>';
          // Add the data rows
          this.medicinebillStatus.forEach(record => {
               doc += '<tr>';
               doc += '<th>' + record.Patient_Name__c + '</th>';
               doc += '<th>' + record.Patient_medical_List__c + '</th>';
               doc += '<th>' + record.Amount__c + '</th>';


               doc += '</tr>';
          });
          doc += '</table>';
          var element = 'data:application/vnd.ms-excel,' + encodeURIComponent(doc);
          let downloadElement = document.createElement('a');
          downloadElement.href = element;
          downloadElement.target = '_self';
          // use .csv as extension on below line if you want to export data as csv
          downloadElement.download = 'PatientBill.xls';
          document.body.appendChild(downloadElement);
          downloadElement.click();
     }



     closeupdatedetailsModal() {
          this.openUpdateDetails = false;
     }

     patientChange(event) {

          this.patientSatus = event.target.value;

     }


     updateDetails() {
          this.openDatatable = false;
          updatepatientdata({ status: this.patientSatus, id: this.appoinmentId}).then(result => {
               this.updateStatus = result;
               const event = new ShowToastEvent({
                    title: 'STATUS',
                    message:
                         'UPDATE SUCCESSFULLY!!!!!'
               });
               this.dispatchEvent(event);
               // eval("$A.get('e.force:refreshView').fire();");

               this.openDatatable = false;
               this.openUpdateDetails = false;
               return refreshApex(result);

          })


     }


     selectedRecords(event) {

          const selectedRows = event.detail.selectedRows;
          this.selectedpatientList = [];
          console.log('selectedRows::::' + selectedRows);
          console.log('selectedRows:11111:::' + selectedRows.length);

          for (let i = 0; i < selectedRows.length; i++) {
               this.selectedpatientList.push(selectedRows[i]);
          }


     }


     deleteRecords() {

          deleterecords({ key: this.selectedpatientList }).then(result => {
               this.deleterecordsStatus = result

          })
     }


     nameorphonechange(event){
          this.nameorphone=event.target.value;
     }

     serchClick(event){

this.value=event.target.value;
console.log('::::::::'+this.nameorphone);

searchPatient({name:this.nameorphone}).then(result=>{

     this.searchPatientStatus=result;

     console.log('dataa::::::::::'+this.searchPatientStatus.length);
if(this.searchPatientStatus.length>0){
     this.openDatatable=false;
     this.openSearchPatientdata=true;
}else{
     this.openSearchPatientdata=false;
     this.patientnotavailible=true;
     this.openDatatable=false;
     console.log('No Records');
}


})

     }


    
     openprofile=false;
     openprofilemodel(){
          
          if(this.openprofile==true){
               this.openprofile=false;
          }else if(this.openprofile==false){
               this.openprofile=true;
          }
     } 
     leavetempOpen=false;
     openleavetemp(){
   this.leavetempOpen=true;
   this.openprofile=false;
     }

     closeleavetemp(){
     this.leavetempOpen=false;
     
     }
     totalleaves;
     triggererrormsg;
     leaveerrortemp=false;
     @track leavedetailes={
          Doctor_Name__c:namefield,
          From_Date__c:fromdatefield,
          To_Date__c:todatefield,
          Reason__c:reasonfield,
          Doctor__c:doctorid
     }

   
     fromdatechange(event){
      this.leavedetailes.From_Date__c=event.target.value;
     }
     todatechage(event){
          this.leavedetailes.To_Date__c=event.target.value;
     }
     reasonchange(event){
          this.leavedetailes.Reason__c=event.target.value;
     }

     submitDetails(){
          this.leavedetailes.Doctor__c=this.doctorid;
     //  if(this.leavedetailes.From_Date__c<=this.leavedetailes.To_Date__c){

      
     this.leavedetailes.Doctor_Name__c=this.name;
          insertleavedetailes({key:this.leavedetailes})
          .then(result=>{
               this.totalleaves=result;
               console.log('totalleaves::' +this.totalleaves);
               this.leavetempOpen=false;

               const event= new ShowToastEvent({
                    title:'STATUS',
                    message:'Leave Applied Successfully',
                    variant:'success'
               });
               this.dispatchEvent(event);


          }).catch(error=>{
               this.error=error;
               this.triggererrormsg=this.error.body.pageErrors[0].message;
               console.log(';;;;;;;;'+this.triggererrormsg);
               this.leaveerrortemp=true;
          })

          
          
     // }else{
     //      //this.leaveerrortemp=true;
     // }
     }

//change pwd
     changepwdtemp=false;
     oldpwd;
     newpwd;
     confirmpwd;
     updatestatus;
     changeerrormegtemp=false;
     changeerror;
     openchangepwdtemp(){
          this.changepwdtemp=false;

     }
     openchangeclosepwd(){
        this.changepwdtemp=false;
        this.changeerrormegtemp=false;  
     }

     changepasswordtemp(){
          this.changepwdtemp=true;

     }
     oldpwdchange(event){
       this.oldpwd=event.target.value;
     }
     newpwdchange(event){
     this.newpwd=event.target.value;
     }
     confirmpwdchange(event){
      this.confirmpwd=event.target.value;
     } 
     updatepwdclick(){
          if(this.newpwd==this.confirmpwd){
           
     updatepwdmethod({username:this.doctorusername,oldpwd:this.oldpwd,confirmpwd:this.confirmpwd}).then(result=>{
       this.updatestatus=result;
       if(this.updatestatus=='success'){
          this.changepwdtemp=false;


          const event= new ShowToastEvent({
               title:'STATUS',
               message:'Password Update Successfully',
               variant:'success'
          });
          this.dispatchEvent(event);




       }else{
         this.changeerrormegtemp=true;

         this.changeerror='incorrect old pwd';
       }
     })


          }else{
               this.changeerror='new pwd confirmpwd not same';
               this.changeerrormegtemp=true; 
          }
     }
     
     viewid;
     viewpatientdetailstemp=false;
     ViewClick(event){
          this.viewid=event.target.name;
          this.viewpatientdetailstemp=true;
          console.log(';;;;;;;'+this.viewid);
     }

     closeModalview(){
          this.viewpatientdetailstemp=false;
     }
    @api patientid;
     updatepatientdetailstemp=false;
     EditClick(event){
          console.log(';;ineditform');
        this.patientid=event.target.name;
        this.updatepatientdetailstemp=true;
        console.log(';;;;;;'+this.patientid);
     }
     closeModaledit(){
          this.updatepatientdetailstemp=false;
     }

     handleSubmit(event) {
          console.log('onsubmit event recordEditForm'+ event.detail.fields);
          this.updatepatientdetailstemp=false;
      }
      handleSuccess(event) {
          console.log('onsuccess event recordEditForm', event.detail.id);
          window.location.reload(true);
          this.dispatchEvent(

               new ShowToastEvent({
                   title: 'Success',
                   message: 'Update successfully',
                   variant: 'success',
               }),
           );
      }
      updpres;
      presstemp=false;
      pressClick(event){
           console.log(';;;;;');
           this.updpres=event.target.name;
           this.presstemp=true;
           console.log(';;;;'+this.updpres);
      }
      pressform(){
          this.presstemp=false;
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
                this.presstemp=false;
            });
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Prescription successfully created',
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
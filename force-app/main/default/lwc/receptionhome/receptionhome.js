import { LightningElement } from 'lwc';
import getOutpatients from '@salesforce/apex/TwssMedicalHospitalController.getOutpatients';
import getInpatients from '@salesforce/apex/TwssMedicalHospitalController.getInpatients';
import searchPatient from '@salesforce/apex/TwssMedicalHospitalController.searchPatient';
import searchDoctor from '@salesforce/apex/TwssMedicalHospitalController.searchDoctor';
const outpcolumns = [
    { label: 'Patient Name', fieldName: 'Name__c' },
    { label: 'Mobile Number', fieldName: 'Mobile_Number__c', type: 'phone' },
    { label: 'Appointment Date', fieldName: 'Appointment_Date__c', type: 'date' },
    { label: 'Assigned Doctor', fieldName: 'Doctor__c' },
    { label: 'Patient Availability', fieldName: 'PatientAvailability__c'  },
    { label: 'Patient Status', fieldName: 'Patient_Status__c' },

    
];

const inpcolumns = [
    { label: 'Patient Name', fieldName: 'Name__c' },
    { label: 'Mobile Number', fieldName: 'Mobile_Number__c', type: 'phone' },
    { label: 'Appointment Date', fieldName: 'Appointment_Date__c', type: 'date' },
    { label: 'Assigned Doctor', fieldName: 'Doctor__c' },
    { label: 'Patient Availability', fieldName: 'PatientAvailability__c'  },
    { label: 'Patient Status', fieldName: 'Patient_Status__c' },

    
];

const patientdata = [
    { label: 'Id', fieldName: 'Name' },
    { label: 'Appointment Date', fieldName: 'Appointment_Date__c' },
    { label: 'Name', fieldName: 'Name__c' },
    { label: 'Mobile Number', fieldName: 'Mobile_Number__c' },
    { label: 'EmailId', fieldName: 'Email_Id__c'},
    { label: 'Speciality', fieldName: 'Speciality__c'},
    { label: 'Reason', fieldName: 'Write_Reasons__c'},
   
];

export default class Receptionhome extends LightningElement {
    outpcolumns=outpcolumns;
    inpcolumns=inpcolumns;
    patientdata=patientdata;
    searchPatientStatus;

    inpatientlist;
    doctorName;

    outpatient=false;
    inpatient=false;
    searchPatienttemp=false;

    patientlist;
    searchDoctorStatus;
    searchpatienterror;
    outpatients(){

getOutpatients({}).then(result=>{
    this.patientlist=result;
console.log('::::'+this.patientlist);

if(this.patientlist.length>0){
this.outpatient=true;
this.inpatient=false;
this.searchPatienttemp=false; 
}else{
    this.outpatient=false;  
    console.log('no:::::::::::');
}

})

    }


    inpatientsClick(){

getInpatients({}).then(result=>{
    this.inpatientlist=result;
if( this.inpatientlist.length>0){
    this.outpatient=false;
this.inpatient=true;
this.searchPatienttemp=false; 

}

})

    }

    searchnameorphoneChange(event){
        this.nameorphone=event.target.value;
    }


    searchpatientClick(){

if(this.nameorphone==null || this.nameorphone==''){
alert('Please Enter the Patient Name');
}else{

        searchPatient({name:this.nameorphone}).then(result=>{

            this.searchPatientStatus=result;
       
          
       if(this.searchPatientStatus.length>0){
           this.searchPatienttemp=true;
           this.inpatient=false;
           this.outpatient=false;
       }else{
        this.searchPatienttemp=false;   

this.searchpatienterror='Patient Is Not Available';

        console.log('Patient is not Available');
       }
       
       
       })
       
    }
    }


    doctornamechange(event){
        this.doctorName=event.target.value;
        
             }
        
             searchDoctorClick(){
        
              
                if(this.doctorName==null || this.doctorName==''){
                    console.log('name::::'+this.doctorName);
                    alert('Please Enter the Doctor Name');
                }else{

               
                 
                  searchDoctor({name:this.doctorName}).then(result=>{
                       this.searchDoctorStatus=result;
                       console.log(' this.searchDoctorStatus:::'+ this.searchDoctorStatus);


                  })
        
             }
            }

}
import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import 	SPECIALITY from '@salesforce/schema/BookAppointment__c.Speciality__c';
import 	DOCTOR from '@salesforce/schema/BookAppointment__c.Doctor__c';
import 	NAME from '@salesforce/schema/BookAppointment__c.Name__c';
import 	MOBILENUMBER from '@salesforce/schema/BookAppointment__c.Mobile_Number__c';
import 	APPOINTMENTDATE from '@salesforce/schema/BookAppointment__c.Appointment_Date__c';
import 	REASON from '@salesforce/schema/BookAppointment__c.Write_Reasons__c';
import EMAILID from '@salesforce/schema/BookAppointment__c.Email_Id__c';
import PATIENTSTATUS from '@salesforce/schema/BookAppointment__c.Patient_Status__c';
import PATIENTAVAILABILITY from '@salesforce/schema/BookAppointment__c.PatientAvailability__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveAppointmemt from '@salesforce/apex/TwssMedicalHospitalController.saveAppointmemt';
import emailverification from '@salesforce/apex/TwssMedicalHospitalController.getnameandmobile';
export default class AppNewUser extends NavigationMixin(LightningElement) {

  
    buttonName;
    speciality;
    doctorName;
    name;
    appointmemtDate;
    saveAppointmemtStatus;
    errormsg;
    emailverificationStatus;
  
    


    appointmemtdetatlis={
        Speciality__c:SPECIALITY,
        Doctor__c:DOCTOR,
        Name__c:NAME,
        Mobile_Number__c:MOBILENUMBER,
        Email_Id__c:EMAILID,
        Appointment_Date__c:APPOINTMENTDATE,
        Write_Reasons__c:REASON,
        Patient_Status__c:PATIENTSTATUS,
        PatientAvailability__c:PATIENTAVAILABILITY
    }




    specialityChange(event){
        this.speciality=event.target.value;
        
        this.appointmemtdetatlis.Speciality__c=event.target.value;
            }
        
            doctorChange(event){
        this.doctorName=event.target.value;
        this.appointmemtdetatlis.Doctor__c=event.target.value;
            }
        
            nameChange(event){
        
                this.name=event.target.value;
                this.appointmemtdetatlis.Name__c=event.target.value;
            }
        
            mobileChange(event){
        this.mobile=event.target.value;
        this.appointmemtdetatlis.Mobile_Number__c=event.target.value;
        
            }
        
            appointmemtDateChange(event){
        this.appointmemtDate=event.target.value;
        this.appointmemtdetatlis.Appointment_Date__c=event.target.value;
        
        console.log('date:::'+this.appointmemtDate);
            }
        
            reasonchange(event){
                this.appointmemtdetatlis.Write_Reasons__c=event.target.value;
            }
        
            emailChange(event){
        this.appointmemtdetatlis.Email_Id__c=event.target.value;

            }
        


    submitClick(){
this.appointmemtdetatlis.Patient_Status__c='Pending';


this.appointmemtdetatlis.PatientAvailability__c='Out-Patient';

console.log('this.appointmemtdetatlis.PatientAvailability__c:::::::::::'+this.appointmemtdetatlis.PatientAvailability__c);


console.log('this.appointmemtdetatlis.Email_Id__c:::'+this.appointmemtdetatlis.Email_Id__c);


emailverification({email:this.appointmemtdetatlis.Email_Id__c}).then(result=>{
    this.emailverificationStatus=result;
console.log('this.emailverificationStatus::::::::'+this.emailverificationStatus.length);

if(this.emailverificationStatus.length>0){
this.errormsg='Email already exits';

}else{



    saveAppointmemt({key:this.appointmemtdetatlis}).then(result=>{
        this.saveAppointmemtStatus=result;
        
        console.log('this.saveAppointmemtStatus::::::::'+this.saveAppointmemtStatus);
        
        
        if(this.saveAppointmemtStatus=='Success'){
        
        
        const event = new ShowToastEvent({
        title: 'Successfully Booked',
        message:
            'Thank You',
        });
        this.dispatchEvent(event);
        
        
        
        
        this[NavigationMixin.Navigate]({
        type: 'standard__component',
        attributes: {
            componentName: 'c__Home_comp'
        },
        
        });
        
        
        }else{
        
        this.errormsg=this.saveAppointmemtStatus;
        
        }
        
        })

}

})




// this.isModalOpen = false;
}




}
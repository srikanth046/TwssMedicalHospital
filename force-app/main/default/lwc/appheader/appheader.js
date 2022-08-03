import { LightningElement,track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import 	SPECIALITY from '@salesforce/schema/BookAppointment__c.Speciality__c';
import 	DOCTOR from '@salesforce/schema/BookAppointment__c.Doctor__c';
import 	NAME from '@salesforce/schema/BookAppointment__c.Name__c';
import 	MOBILENUMBER from '@salesforce/schema/BookAppointment__c.Mobile_Number__c';
import 	APPOINTMENTDATE from '@salesforce/schema/BookAppointment__c.Appointment_Date__c';
import 	REASON from '@salesforce/schema/BookAppointment__c.Write_Reasons__c';
import EMAILID from '@salesforce/schema/BookAppointment__c.Email_Id__c';
import PATIENTSTATUS from '@salesforce/schema/BookAppointment__c.Patient_Status__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class Appheader extends NavigationMixin(LightningElement) {
    @track isModalOpen = false;
    buttonName;
    speciality;
    doctorName;
    name;
    appointmemtDate;
    saveAppointmemtStatus;
    errormsg;
    opencheckNewuserOrolduser=false;


    appointmemtdetatlis={
        Speciality__c:SPECIALITY,
        Doctor__c:DOCTOR,
        Name__c:NAME,
        Mobile_Number__c:MOBILENUMBER,
        Email_Id__c:EMAILID,
        Appointment_Date__c:APPOINTMENTDATE,
        Write_Reasons__c:REASON,
        Patient_Status__c:PATIENTSTATUS
    }

    ///////////////////////////////////

    handleonclick(event){
        this.buttonName=event.target.name;
        
        if(this.buttonName=='Doctors'){
        
            this[NavigationMixin.Navigate]({
                type: 'standard__component',
                attributes: {
                    componentName: 'c__Doctorscomp'
                },
               
            });
        
        
        
        }else if(this.buttonName=='Home'){
        
            this[NavigationMixin.Navigate]({
                type: 'standard__component',
                attributes: {
                    componentName: 'c__Home_comp'
                },
               
            });
        
        }else if(this.buttonName=='Services'){
        
            this[NavigationMixin.Navigate]({
                type: 'standard__component',
                attributes: {
                    componentName: 'c__About_comp'
                },
               
            });
        
        }else if(this.buttonName=='Contact Us'){
        
            this[NavigationMixin.Navigate]({
                type: 'standard__component',
                attributes: {
                    componentName: 'c__Contactus_comp'
                },
               
            });
        
            
        
        }else if(this.buttonName=='Login'){
        
            //eval("$A.get('e.force:refreshView').fire();");
            this[NavigationMixin.Navigate]({
                type: 'standard__component',
                attributes: {
                    componentName: 'c__Login_comp'
                },
               
            });
           // eval("$A.get('e.force:refreshView').fire();");
        }else if(this.buttonName=='Book Appointment'){
        
           
        
            this[NavigationMixin.Navigate]({
                type: 'standard__component',
                attributes: {
                    componentName: 'c__Appointment_comp'
                },
               
            });
        
        }else if(this.buttonName=='Reception Login'){
        
            this[NavigationMixin.Navigate]({
                type: 'standard__component',
                attributes: {
                    componentName: 'c__ReceptionLogin_comp'
                },
               
            });
        
        }
        
        
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
        
        
            openModal() {
                // to open modal set isModalOpen tarck value as true
                //this.isModalOpen = true;
                this.opencheckNewuserOrolduser=true;
            }
            closeModal() {
                // to close modal set isModalOpen tarck value as false
                this.isModalOpen = false;
            }
        
        
        
            submitDetails() {
               
        
        this.appointmemtdetatlis.Patient_Status__c='Pending';
        
        
        
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
               // this.isModalOpen = false;
            }
        
        
        
        
            doctorlogin(){
              
                this[NavigationMixin.Navigate]({
                    type: 'standard__component',
                    attributes: {
                        componentName: 'c__Login_comp'
                    },
                   
                });
        
            }
        
            receptionlogin(){
        
                this[NavigationMixin.Navigate]({
                    type: 'standard__component',
                    attributes: {
                        componentName: 'c__ReceptionLogin_comp'
                    },
                   
                });
        
            }
        

}``
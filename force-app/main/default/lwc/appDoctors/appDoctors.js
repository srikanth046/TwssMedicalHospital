import { LightningElement } from 'lwc';

import SPECIALITY from '@salesforce/schema/BookAppointment__c.Speciality__c';
import DOCTOR from '@salesforce/schema/BookAppointment__c.Doctor__c';
import NAME from '@salesforce/schema/BookAppointment__c.Name__c';
import MOBILENUMBER from '@salesforce/schema/BookAppointment__c.Mobile_Number__c';
import APPOINTMENTDATE from '@salesforce/schema/BookAppointment__c.Appointment_Date__c';
import REASON from '@salesforce/schema/BookAppointment__c.Write_Reasons__c';
import EMAILID from '@salesforce/schema/BookAppointment__c.Email_Id__c';
import PATIENTSTATUS from '@salesforce/schema/BookAppointment__c.Patient_Status__c';
import PATIENTAVAILABILITY from '@salesforce/schema/BookAppointment__c.PatientAvailability__c';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getDescription from '@salesforce/apex/TwssMedicalHospitalController.getDescription';
import saveanappointment from '@salesforce/apex/TwssMedicalHospitalController.bookanappointment';
import checkAvailbilitytoday from '@salesforce/apex/TwssMedicalHospitalController.checkAvailbilitytoday';

export default class AppDoctors extends LightningElement {

    doctorname;
    isModalOpen = false;
    doctordescription;
    descriptionlist;
    specialist;
    booknowtemp = false;

    patientName;
    mobilenumber;
    emailid;
    appointmentDate;
    reason;
    status;
    errormsg;
    doctorphoto;
    checkAvailbilitytodayStatus;
    checkAvailbilityStatus=false;
    errormsgetemp=false;

    appointmemtdetatlis = {
        Speciality__c: SPECIALITY,
        Doctor__c: DOCTOR,
        Name__c: NAME,
        Mobile_Number__c: MOBILENUMBER,
        Email_Id__c: EMAILID,
        Appointment_Date__c: APPOINTMENTDATE,
        Write_Reasons__c: REASON,
        Patient_Status__c: PATIENTSTATUS,
        PatientAvailability__c: PATIENTAVAILABILITY
    }


    imgclick(event) {
        this.isModalOpen = true;
        this.doctorname = event.target.name;
        this.appointmemtdetatlis.Doctor__c=event.target.name;

        getDescription({ name: this.doctorname }).then(result => {

            this.descriptionlist = result;
            this.doctordescription = this.descriptionlist[0].Description__c;

            this.specialist = this.descriptionlist[0].Specialist__c;
            console.log(':Description :::' + this.descriptionlist[0].Description__c);
            this.appointmemtdetatlis.Speciality__c=this.specialist;

            this.doctorphoto=this.descriptionlist[0].Photo__c;
        })

    }


    closeModal() {
        this.checkAvailbilityStatus=false;
        this.isModalOpen = false;
        this.errormsgetemp=false;
    }
    submitDetails() {

        this.isModalOpen = false;
    }

    closebooktempModal() {
        this.checkAvailbilityStatus=false;
        this.booknowtemp = false;
        this.errormsgetemp=false;
    }

    booknow() {
        this.booknowtemp = true
        this.isModalOpen = false;
    }

    nameChange(event) {

        this.patientName = event.target.value;

    }

    mobilenumberChange(event) {
        this.mobilenumber = event.target.value;

    }

    emailIdChange(event) {
        this.emailid = event.target.value;

    }

    appointmentdateChange(event) {
        this.appointmentDate = event.target.value;
    }

    reasonChange(event) {

        this.reason = event.target.value;
    }


    bookanappointment() {
        this.checkAvailbilityStatus=false;
        console.log('specialist:::::::::' + this.appointmemtdetatlis.Speciality__c);
        console.log('doctorname::::::::' + this.appointmemtdetatlis.Doctor__c);

        this.appointmemtdetatlis.Name__c = this.patientName;
        this.appointmemtdetatlis.Mobile_Number__c = this.mobilenumber;
        this.appointmemtdetatlis.Email_Id__c = this.emailid;
        this.appointmemtdetatlis.Appointment_Date__c = this.appointmentDate;
        this.appointmemtdetatlis.Write_Reasons__c = this.reason;
        this.appointmemtdetatlis.Patient_Status__c = 'Pending';
        this.appointmemtdetatlis.PatientAvailability__c ='Out-Patient';
        
        saveanappointment({ key: this.appointmemtdetatlis,doctorname:this.doctorname,specialist:this.specialist }).then(result => {
this.status=result;
console.log('Status:::'+this.status);

if(this.status=='Slots Not Available'){

    this.errormsgetemp=true;
    this.errormsg='Slots Not Available';
console.log('Slots Not Available');

}else if(this.status=='Doctor Not Available'){
    this.errormsgetemp=true;
    this.errormsg='Doctor Not Available . Please select another date!!!!!';
}else{
    this.errormsgetemp=false;
    const event = new ShowToastEvent({
        title: 'SuccessFully Booked',
        message:this.status,
        variant:"success"
            
    });
    this.dispatchEvent(event);
    this.booknowtemp = false;
    this.checkAvailbilityStatus=false;

}

        })


    }


    checktodayAvailbility(){
        this.errormsgetemp=false;
checkAvailbilitytoday({name:this.doctorname}).then(result=>{

    this.checkAvailbilitytodayStatus=result;

    this.checkAvailbilityStatus=true;

    console.log('this.checkAvailbilitytodayStatus:::'+this.checkAvailbilitytodayStatus);
})


    }

}
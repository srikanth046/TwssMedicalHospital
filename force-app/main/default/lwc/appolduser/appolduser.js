import { LightningElement } from 'lwc';
import SPECIALITY from '@salesforce/schema/BookAppointment__c.Speciality__c';
import DOCTOR from '@salesforce/schema/BookAppointment__c.Doctor__c';
import NAME from '@salesforce/schema/BookAppointment__c.Name__c';
import MOBILENUMBER from '@salesforce/schema/BookAppointment__c.Mobile_Number__c';
import APPOINTMENTDATE from '@salesforce/schema/BookAppointment__c.Appointment_Date__c';
import REASON from '@salesforce/schema/BookAppointment__c.Write_Reasons__c';
import EMAILID from '@salesforce/schema/BookAppointment__c.Email_Id__c';
import PATIENTSTATUS from '@salesforce/schema/BookAppointment__c.Patient_Status__c';
import verifyEmail from '@salesforce/apex/TwssMedicalHospitalController.verifyEmail';
import verifyCotp from '@salesforce/apex/TwssMedicalHospitalController.verifyCotp';
import getnameandmobile from '@salesforce/apex/TwssMedicalHospitalController.getnameandmobile'
import saveAppointmemt from '@salesforce/apex/TwssMedicalHospitalController.saveAppointmemt';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import PATIENTAVAILABILITY from '@salesforce/schema/BookAppointment__c.PatientAvailability__c';
export default class Appolduser extends NavigationMixin(LightningElement) {

    email;
    verifyEmailStatus;
    errormsg;
    verifyEmailtemp = true;
    verifyOtp = false;
    otp;
    verifyCotpStatus;
    openBookAppointment = false;
    speciality;
    doctorName;
    appointmemtdate;
    writeReason;
    bookAppoinmentStatus;
    saveAppointmemtStatus;
    otperrormsg;
   
    emailChange(event) {
        this.email = event.target.value;

    }

    otpchange(event) {
        this.otp = event.target.value;
    }

    submitClick() {
        console.log('this.email::::::' + this.email);

        if (this.email == '' || this.email == null) {
            this.errormsg = 'Please Enter Email';
        } else {

            verifyEmail({ email: this.email }).then(result => {

                this.verifyEmailStatus = result;

                console.log('this.verifyEmailStatus:::::' + this.verifyEmailStatus);



                if (this.verifyEmailStatus == 'Success') {
                   
                    this.verifyEmailtemp = false;
                    this.verifyOtp = true;







                } else {

                    this.errormsg = this.verifyEmailStatus;

                }

            })


        }

    }



    verifyotp() {

        verifyCotp({ email: this.email, otp: this.otp }).then(result => {

            this.verifyCotpStatus = result;

            console.log('this.verifyCotpStatus:::' + this.verifyCotpStatus);

            if (this.verifyCotpStatus == 'Success') {
               
                this.verifyOtp = false;
                this.openBookAppointment = true;

            }else{
                this.otperrormsg=this.verifyCotpStatus;
            }

        })




    }

    bookAppointmentDetails = {

        Speciality__c: SPECIALITY,
        Doctor__c: DOCTOR,
        Appointment_Date__c: APPOINTMENTDATE,
        Write_Reasons__c: REASON,
        Email_Id__c: EMAILID,
        Name__c: NAME,
        Mobile_Number__c: MOBILENUMBER,
        Patient_Status__c: PATIENTSTATUS,
        PatientAvailability__c:PATIENTAVAILABILITY
    }



    specialityChange(event) {

        this.bookAppointmentDetails.Speciality__c = event.target.value;

    }

    doctorChange(event) {
        this.bookAppointmentDetails.Doctor__c = event.target.value;

    }

    appointmentdatechange(event) {
        this.bookAppointmentDetails.Appointment_Date__c = event.target.value;

    }

    writeReasonChange(event) {
        this.bookAppointmentDetails.Write_Reasons__c = event.target.value;

    }



   


    bookNowClick() {

        console.log('this.speciality:::' + this.bookAppointmentDetails.Speciality__c);
        console.log('this.doctorName:::' + this.bookAppointmentDetails.Doctor__c);
        console.log('this.appointmemtdate:::' + this.bookAppointmentDetails.Appointment_Date__c);
        console.log('this.writeReason:::' + this.bookAppointmentDetails.Write_Reasons__c);




        //this.bookAppointmentDetails.Write_Reasons__c = this.writeReason;
        //this.bookAppointmentDetails.Email_Id__c=this.email;

        getnameandmobile({ email: this.email }).then(result => {

            this.bookAppoinmentStatus = result;



            this.bookAppointmentDetails.Name__c = this.bookAppoinmentStatus[0].Name__c;
            this.bookAppointmentDetails.Mobile_Number__c = this.bookAppoinmentStatus[0].Mobile_Number__c;
            this.bookAppointmentDetails.Email_Id__c=this.email;
            this.bookAppointmentDetails.Patient_Status__c='Pending';
            this.bookAppointmentDetails.PatientAvailability__c='Out-Patient';
            console.log(' this.bookAppointmentDetails.Name__c::::' + this.bookAppointmentDetails.Name__c);
            console.log('  this.bookAppointmentDetails.Mobile_Number__c::::' + this.bookAppointmentDetails.Mobile_Number__c);


            saveAppointmemt({ key: this.bookAppointmentDetails }).then(result => {


                this.saveAppointmemtStatus = result;


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
                    

                console.log('this.saveAppointmemtStatus:::::'+this.saveAppointmemtStatus);

            })



        })

    }

}
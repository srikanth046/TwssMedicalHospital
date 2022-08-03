import { LightningElement } from 'lwc';
import NAME from '@salesforce/schema/ServiceDesk__c.Name__c';
import PHONE from '@salesforce/schema/ServiceDesk__c.phone__c';
import EMAIL from '@salesforce/schema/ServiceDesk__c.email__c';
import SUBJECT from '@salesforce/schema/ServiceDesk__c.Subject__c';
import MESSAGE from '@salesforce/schema/ServiceDesk__c.Message__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import contactusValidations from '@salesforce/apex/TwssMedicalHospitalController.contactusValidations';
import { NavigationMixin } from 'lightning/navigation';
import insertContactus from '@salesforce/apex/TwssMedicalHospitalController.insertContactus';



export default class AppContactus extends NavigationMixin(LightningElement) {


    mapMarkers = [
        {
            location: {
                Street: '314 N. Lake St',
                City: 'Aurora',
                Country: 'USA',
            },
            title: 'The Landmark Building',
            description:
                'Historic <b>11-story</b> building completed in <i>1916</i>',
        },
    ];
phone;
name;
email;
subject;
message;
contactusValidationsStatus;
errormessage;
pattern='/^[a-zA-Z ]{2,30}$/';
namevalidation;
mobilevalidation;

    contactusfields={
        Name__c:NAME,
        phone__c:PHONE,
        email__c:EMAIL,
        Subject__c:SUBJECT,
        Message__c:MESSAGE,

    }

    nameChange(event){
this.contactusfields.Name__c=event.target.value;
this.name=event.target.value;
    }

    phoneChange(event){

        this.contactusfields.phone__c=event.target.value;
        this.phone=event.target.value;
    }

    emailChange(event){
        this.contactusfields.email__c=event.target.value;
        this.email=event.target.value;
    }

    subjectChange(event){
        this.contactusfields.Subject__c=event.target.value;
        this.subject=event.target.value;
    }

    messageChange(event){
        this.contactusfields.Message__c=event.target.value;
        this.message=event.target.value;
    }
    handleClick(){
        console.log('Name::::::::'+this.name);
        console.log('phone::::::::'+this.contactusfields.phone__c.length);
        console.log('Email::::::::'+this.contactusfields.email__c);
        console.log('Subject::::::::'+this.contactusfields.Subject__c);
        console.log('Message::::::::'+this.contactusfields.Message__c);
     
      


contactusValidations({name:this.name,phone:this.phone,email:this.email,subject:this.subject,message:this.message}).then(result=>{

    this.contactusValidationsStatus=result;

    console.log(':::::::::::::'+this.contactusValidationsStatus);


if(this.contactusValidationsStatus=='Success'){

insertContactus({key:this.contactusfields}).then(result=>{
this.insertstatus=result;
console.log('this.insertstatus:::::'+this.insertstatus);

const event = new ShowToastEvent({
    title: 'Message Sent',
    message:
        'SuccessFully Message Sent',
        
});
this.dispatchEvent(event);


 this[NavigationMixin.Navigate]({
        type: 'standard__component',
        attributes: {
            componentName: 'c__Home_comp'
        },
       
    });


})


}else{



this.errormessage=this.contactusValidationsStatus;
}


})

       
    }


    

}
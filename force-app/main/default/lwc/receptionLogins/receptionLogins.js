import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import receptionLogins from '@salesforce/apex/TwssMedicalHospitalController.receptionLogins';
export default class ReceptionLogins extends NavigationMixin(LightningElement) {

    email;
    password;
    receptionLoginsStatus;
    loginerror;
    emailChange(event) {
        this.email = event.target.value;
    }

    passwordChange(event) {
        this.password = event.target.value;
    }

    loginClick() {

        console.log('username::::'+ this.email);
        console.log('this.password::::'+ this.password);


receptionLogins({email:this.email,password:this.password}).then(result=>{

    this.receptionLoginsStatus=result;
    console.log(' this.receptionLoginsStatus:::::'+ this.receptionLoginsStatus.length);

    if(this.receptionLoginsStatus.length>0){
        console.log(' this.receptionLoginsStatus:::::'+ this.receptionLoginsStatus[0].Username__c);

        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__ReceptionHome_comp'
            },
           
        });
    


    }else{
        this.loginerror='In-valid Username and Password';
        console.log('In-valid Username and Password');
    }

})



    }



}
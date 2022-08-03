import { LightningElement } from 'lwc';

import registervalidation from '@salesforce/apex/TwssMedicalHospitalController.registervalidation';
import register from '@salesforce/apex/TwssMedicalHospitalController.register';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class AppRegister extends NavigationMixin(LightningElement) {

    value = '';
    gender;
    name;
    username;
    password;
    registerValaidationSatus;
    registerstatus;
    mobile;
    registererrormsg;
    get options() {
        return [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
        ];
    }


    genderChange(event){
       this.gender= event.target.value;
console.log('Gender::::'+ this.gender);
    }
    nameChange(event){
this.name=event.target.value;
    }

    usernameChange(event){
this.username=event.target.value;
    }

    passwordChange(event){
this.password=event.target.value;
    }
    mobileChange(event){
this.mobile=event.target.value;
    }

    registerClick(){

        registervalidation({name:this.name,username:this.username,password:this.password,gender:this.gender,mobile:this.mobile}).then(result=>{

this.registerValaidationSatus=result;

console.log('this.registerValaidationSatus::::'+this.registerValaidationSatus);


if(this.registerValaidationSatus=='Success'){

    register({name:this.name,username:this.username,password:this.password,gender:this.gender,mobile:this.mobile}).then(result=>{

        this.registerstatus=result;
console.log(' this.registerstatus::::'+ this.registerstatus);

if(this.registerstatus=='Success'){

    const event = new ShowToastEvent({
        title: 'Register Status',
        message:
            'Successfully Register!!!',
    });
    this.dispatchEvent(event);


    this[NavigationMixin.Navigate]({
        type: 'standard__component',
        attributes: {
            componentName: 'c__Login_comp'
        },
       
    });


}

    })

}else{
    this.registererrormsg=this.registerValaidationSatus;
}

        })

    }


    

}
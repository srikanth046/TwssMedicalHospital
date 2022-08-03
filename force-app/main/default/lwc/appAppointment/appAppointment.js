import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class AppAppointment extends NavigationMixin(LightningElement) {
   
    oldUser(){
       // window.location.reload(false);

        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__olduser_comp'
            },
           
        });
    }

    newUser(){


        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__newUser_comp'
            },
           
        });


    }
    



}
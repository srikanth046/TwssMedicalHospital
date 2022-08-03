import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class AppFooter extends NavigationMixin(LightningElement) {


    doctors(){

        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__Doctorscomp'
            },
           
        });

    }

    services(){

        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__About_comp'
            },
           
        });

    }

    contactUs(){
        
        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__Contactus_comp'
            },
           
        });

    }

}
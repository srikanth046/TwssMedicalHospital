import { LightningElement ,api, track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import verifylogin from '@salesforce/apex/TwssMedicalHospitalController.verifylogin';
import { NavigationMixin } from 'lightning/navigation';
import updatepwd from '@salesforce/apex/TwssMedicalHospitalController.updatepwd';
import updatepwdvaladitions from '@salesforce/apex/TwssMedicalHospitalController.updatepwdvaladitions';
export default class AppLogin extends NavigationMixin(LightningElement) {

    
    @track isModalOpen=false;
    @track username;
    @track password;
loginstatus;
loginerrormsg;
@track forgetusername;
@track forgetpassword;
@track conformpassord;
forgotErrormsg;
updatepwdStatus;
updatepwdvaladitionStatus;

    usernameChange(event){
this.username=event.target.value;
    }

    passwordChange(event){
this.password=event.target.value;
    }

    
login(){
    console.log('this.username:::::'+this.username);
    console.log('this.password:::::'+this.password);
this.loginstatus = [];
    //loginvalidation({username:this.username,password:this.password}).then()

if(this.username=='' || this.username==null  ){
this.loginerrormsg='Please Enter the Username';
}else if(this.password=='' || this.password==null){
this.loginerrormsg='Please Enter the Password';
}else{

    verifylogin({username:this.username,password:this.password}).then(result=>{
this.loginstatus=result;
console.log('this.loginstatus::::'+this.loginstatus);

if(this.loginstatus[0]=='Failure'){

this.loginerrormsg='In-valid credentials';


}else{
sessionStorage.clear();
sessionStorage.removeItem("name");
sessionStorage.setItem("name" ,this.loginstatus[1]);
eval("$A.get('e.force:refreshView').fire();");

if(this.loginstatus[0] == 'doctor'){

    this[NavigationMixin.Navigate]({
        type: 'standard__component',
        attributes: {
            componentName: 'c__LoginHome_comp'
        },
    });
    }else if(this.loginstatus[0] == 'pharmacy list'){
        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__PharmacyLogincomp'
            },
           
        });
        }else if(this.loginstatus[0] == 'Reception'){
        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__ReceptionHome_comp'
            },
           
        });
        }
     
eval("$A.get('e.force:refreshView').fire();");

}


    })

}

}


forgetusernameChange(event){

    this.forgetusername=event.target.value;
}

forgetpasswordChange(event){
this.forgetpassword=event.target.value;

}

conformpassordChange(event){

  this.conformpassord=event.target.value;
    
}

forgotpwd() {
    
    this.isModalOpen = true;
}
closeModal() {
    
    this.isModalOpen = false;
}

submitDetails(){



   updatepwdvaladitions({username:this.forgetusername,password:this.forgetpassword,conformpwd:this.conformpassord}).then(result=>{

this.updatepwdvaladitionStatus=result;

console.log('this.updatepwdvaladitionStatus::::'+this.updatepwdvaladitionStatus);

if(this.updatepwdvaladitionStatus=='Success'){

    updatepwd({email:this.forgetusername,pwd:this.conformpassord}).then(result=>{
        this.updatepwdStatus=result;
    if(this.updatepwdStatus=='Success')
    {
        this.isModalOpen = false;
        const event = new ShowToastEvent(
        {
            title: 'Forgot Password ',
            message: 'Updated Successfully',
        });

        this.dispatchEvent(event);
        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__Login_comp'
            },
        });
    }else{
    
        this.forgotErrormsg=this.updatepwdStatus;
    
    }
    
        
    
    })
    



}else{
    this.forgotErrormsg=this.updatepwdvaladitionStatus;
}

   })

   
  





}



register(){

    
    this[NavigationMixin.Navigate]({
        type: 'standard__component',
        attributes: {
            componentName: 'c__Register_comp'
        },
       
    });


}





}
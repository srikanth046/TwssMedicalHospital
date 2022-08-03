import { LightningElement } from 'lwc';
import  appAboutus from './appAboutus.html';
import urology from './urology.html';
import nephrology from './nephrology.html';
import generalmedicine from './generalmedicine.html';
import pulmonology from './pulmonology.html';
import orthopedics from './orthopedics.html';
import dermatology from './dermatology.html';
import cardiology from './cardiology.html';
import neurology from './neurology.html';
import opthamology from './opthamology.html';
export default class AppAboutus extends LightningElement {
   labelname=null;
   back(){
    eval("$A.get('e.force:refreshView').fire();");
    
}
nametaken(event){
       this.labelname=event.target.name;
   }
   render()
   {
       return this.labelname==='UROLOGY' ?  urology : 
       this.labelname==='NEPHROLOGY' ?  nephrology : 
       this.labelname==='GENERALMEDICINE'  ? generalmedicine:
       this.labelname==='PULMONOLOGY'?  pulmonology:
       this.labelname==='ORTHOPEDICS'? orthopedics :
       this.labelname==='DERMATOLOGY'? dermatology : 
       this.labelname==='CARDIOLOGY'? cardiology : 
       this.labelname==='NEUROLOGY'? neurology : 
       this.labelname==='OPTHAMOLOGY'? opthamology : appAboutus
       
       

   }
  
}
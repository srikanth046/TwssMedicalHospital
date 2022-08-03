public with sharing class TwssMedicalHospitalController {
   
    @AuraEnabled
    public static string contactusValidations(string name,string phone, string email,string subject, string message){
    
        /*string name=key.Name__c;
        string phone=key.phone__c;
        string email=key.email__c;
        string subject=key.Subject__c;
        string message=key.Message__c;*/
    
    
        string status=null;
    
        //String regx = "[a-zA-Z]+\\.?"
        if(string.isBlank(name)){
            
            status='Please Enter the Name';
        
        }else if(string.isEmpty(phone)){
            status='Please Enter the Phone Number';
        }else if(!Pattern.matches('[0-9]{10}',phone)){
            status='Mobile Number must be Numarics and 10 digits only!!';
        } else if(string.isEmpty(email)){
            status='Please Enter the Email';
        }else if(!Pattern.matches('^[a-zA-Z0-9._|\\\\%#~`=?&/$^*!}{+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',email)){
            status='In-Valid Email';
        }else if(string.isEmpty(subject)){
            status='Please Enter the Subject';
        }else if(string.isEmpty(message)){
            status='Please Enter the Message';
        
    
       
    }else{
            status='Success';
        }
        return status;
    }
    @AuraEnabled
    public static string insertContactus(ServiceDesk__c key){
    
        insert key;
    
        Messaging.SingleEmailMessage mail=new Messaging.SingleEmailMessage();
        String [] emailId=new String[]{'vasudevarao.ampavilli@gmail.com'};
        mail.setToAddresses(emailId);
        mail.setSubject('Subject '+key.Subject__c);
        mail.setPlainTextBody('Message is::: '+key.Message__c);
        messaging.sendEmail(new Messaging.SingleEmailMessage[]{mail});
       
        return 'Success';
       
    }
    @AuraEnabled
    public static string saveAppointmemt(BookAppointment__c key){
       
        string email=String.valueOf(key.Email_Id__c);
    
        List<BookAppointment__c> lists1=[Select id,Name from BookAppointment__c where Email_Id__c=:email];
    
    
    List<BookAppointment__c> lists=[Select id,Name from BookAppointment__c where Appointment_Date__c=:key.Appointment_Date__c and  Doctor__c=:key.Doctor__c];
    
    if(lists.size()<5){
    
        insert key;
    
        Messaging.SingleEmailMessage mail=new Messaging.SingleEmailMessage();
        String [] emailId=new String[]{key.Email_Id__c};
        mail.setToAddresses(emailId);
        mail.setSubject('Your Appointment  is Booked');
        mail.setPlainTextBody('Your Appointment  is Successfully  Booked  and  Doctor Name:'+key.Doctor__c+' and  Appointment Date is:'+key.Appointment_Date__c);
        messaging.sendEmail(new Messaging.SingleEmailMessage[]{mail});
        return 'Success';
    
    }else{
        return 'Slots Not Available'; 
    }
    
       // insert key;
    
    
    }
    
    //Doctor 
    
    @AuraEnabled
    public static List<String> verifylogin(string username ,string password){
       List<String> ls = new List<String>();  
       List<Doctor__c> lists1=[select Doctor_Name__c,RecordTypeId from Doctor__c where  Username__c=:username and Password__c=:password];
     //List<nurse> lists2=[select Doctor_Name__c  from Doctor__c where  Username__c=:username and Password__c=:password];
       List<Reception__c> lists2=[select Username__c  from Reception__c where  Username__c=:username and Password__c=:password];
       
    if(lists1.size()>0){
        if(lists1[0].RecordTypeId=='0125j000001ZYjLAAW'){
            ls.add('doctor');
            ls.add(lists1[0].Doctor_Name__c);
            return ls;
           }else{
              ls.add('pharmacy list');
               ls.add(lists1[0].Doctor_Name__c);
               return ls;
           }
    }else if(lists2.size()>0 ){
         ls.add('Reception');
         ls.add(lists2[0].Username__c);
         return ls;
    }else {
          ls.add('Failure');
          return ls;
    }
    }
    
    
    @AuraEnabled
    public static List<BookAppointment__c> gettodaypatients(string name){
    
        //TODAY
       Date today= Date.today();
        List<BookAppointment__c> lists=[select Name, Name__c,Appointment_Date__c,Write_Reasons__c,Doctor__c,PatientAvailability__c,Patient_Status__c  from BookAppointment__c where Doctor__c=:name and Appointment_Date__c=TODAY];
        
    return lists;
    
    
    }
    
    
    
    @AuraEnabled
    public static string updatepwdvaladitions(string username, string password, string conformpwd){
      string  validationstatus=null;
    
    if(string.isEmpty(username)){
        validationstatus='User Name is Empty';
    }else if(!Pattern.matches('^[a-zA-Z0-9._|\\\\%#~`=?&/$^*!}{+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',username)){
        validationstatus='In-Valid Email';
    
    }else if(string.isEmpty(password)){
        validationstatus='Please Enter the Password';
    }else if(string.isEmpty(conformpwd)){
        validationstatus='Please Enter the Conform Password';
    }else if(!password.equals(conformpwd)){
        validationstatus='Password And Conform Password Not match';
    }else {
        validationstatus='Success';
    }
    
    return validationstatus;
    
    }
    

@AuraEnabled
    public static List<Medicine__c> getavailableMedicineopenlist(){
    List<Medicine__c> ls=[select id,Name,Medicines_Price__c,Total_Quantity__c from Medicine__c ];
        return ls;
    }
    
    //getmedicineShortageopenlist//
    
    @AuraEnabled
    public static List<Medicine__c> getmedicineShortageopenlist(){
    List<Medicine__c> ls=[select id,Name,Medicines_Price__c,Total_Quantity__c from Medicine__c where Total_Quantity__c<100];
        return ls;
    } 
    @AuraEnabled
    public static List<Prescription__c> getpatientprescriptionlist(String patientid){
        List<BookAppointment__c> patientlist=[select Id from BookAppointment__c where Name=:patientid];
    List<Prescription__c> ls=[select Name,Quantity__c,Patient_Name__c,medicine_name__c,medicine_Price__c,Medicine_with_Quantity_price__c,doctors_name__c from Prescription__c where BookAppointment__c=:patientlist[0].Id];
        return ls;
  }
    @AuraEnabled
    public static string updatepwd(string email,string pwd){
       
    
    List<Doctor__c> lists=[select id,Name from Doctor__c where Username__c=:email];
    
    if(lists.size()>0){
    
    for (Doctor__c d : lists) {
        d.Username__c=email;
        d.Password__c=pwd;
    }
    
       
        
        update lists;
    
        return 'Success';
    
    }else{
    
    
    
    return 'In-Valid User Name';
    
    
    }
    
    }
    
    
    @AuraEnabled
    public static string registervalidation(string name,string username,string password,string gender,string mobile){
    
        
    string registervalidationstatus=null;
    
    if(string.isEmpty(name)){
        registervalidationstatus='Please Enter the Name';
    }else if(string.isEmpty(mobile)){
        registervalidationstatus='Please Enter the Mobile Number';
    }else if(!Pattern.matches('[0-9]{10}',mobile)){
    
        registervalidationstatus='Mobile Number Must be Numarics and 10 Digits';
    
    }else if(string.isEmpty(gender)){
        registervalidationstatus='Please Enter the Gender';
    }else if(string.isEmpty(username)){
        registervalidationstatus='Please Enter the UserName';
    }else if(!Pattern.matches('^[a-zA-Z0-9._|\\\\%#~`=?&/$^*!}{+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',username)){
        registervalidationstatus='In-Valid Email';
    }else if(string.isEmpty(password)){
        registervalidationstatus='Please Enter the Password';
    
    }else {
        registervalidationstatus='Success';
    }
    return registervalidationstatus;
    }
    
    
    @AuraEnabled
    public static string register(string name,string username,string password,string gender,string mobile){
        
        Doctor__c d=new Doctor__c();
        d.Doctor_Name__c=name;
        d.Username__c=username;
        d.Password__c=password;
        d.Gender__c=gender;
        d.Mobile__c=mobile;
    
        insert d;
    
        return 'Success';
    }
    
    
    // @AuraEnabled
    // public static string savemedicineform(Date date, string patientName,string doctorName,string medicinelist ){
        
    // 	Pharmacy__c p= new 	Pharmacy__c();
    //     p.Date__c=date;
    //     p.Patient_Name__c=patientName;
    //     p.Doctor_Name__c=doctorName;
    //     p.Medicine_List__c=medicinelist;
    
    //     insert p;
    
    //     return '';
    
    
    // }
    
    @AuraEnabled
    public static string savemedicineform(Pharmacy__c key){
      
        insert key;
    
        return 'Success';
    }
    
    @AuraEnabled
    public static List<MedicalBill__c> medicinebill(string key){
        
    List<Pharmacy__c> lists=[select Medicine_List__c,Patient_Name__c from Pharmacy__c where Medicine_List__c=:key];
    
    
    string s=lists[0].Medicine_List__c;
    String[] namesList = s.split(';');
    Integer amount=0;
    
    
     for(String listsss:namesList){
        System.debug('Hii::::::::'+listsss);	        
         
                    if(listsss == 'Augmentin'){
                        amount = amount + 10;
                        
                    } else if(listsss == 'Flagyl'){
                        amount = amount + 20;
                    } else if(listsss == 'Keflex.'){
                        amount = amount + 30;
                    } else if(listsss == 'Amoxil'){
                        amount = amount + 40;
                    } else if(listsss == 'Cipro'){
                        amount = amount + 20;
                    }else if(listsss == 'Keflex'){
                        amount = amount + 20;
                    }else if(listsss == 'Levaquin'){
                        amount = amount + 20;
                    }else if(listsss == 'Zithromax'){
                        amount = amount + 20;
                    }else if(listsss == 'Paracetamol'){
                        amount = amount + 20;
                    }else if(listsss == 'Carbamazepine'){
                        amount = amount + 20;
                    }else if(listsss == 'Diazepam'){
                        amount = amount + 20;
                    }else if(listsss == 'Denazepril'){
                        amount = amount + 20;
                    }else if(listsss == 'Captopril'){
                        amount = amount + 20;
                    }else if(listsss == 'Enalapri'){
                        amount = amount + 20;
                    }else if(listsss == 'Enalapri'){
                        amount = amount + 20;
                    }
                
                }
     
    System.debug('Amount::'+amount);
    
    string pname=lists[0].Patient_Name__c;
    MedicalBill__c m=new MedicalBill__c();
    m.Patient_medical_List__c=lists[0].Medicine_List__c;
    m.Amount__c=amount;
    m.Patient_Name__c=pname;
    
    insert m;
    
    
     List<MedicalBill__c> medicalListss=[select Patient_Name__c, Patient_medical_List__c ,Amount__c from MedicalBill__c where Patient_Name__c=:pname ];
    
    
     return  medicalListss;
    
    }
    
    
    @AuraEnabled
    public static string updatepatientdata(string status,string id){
       
        List<BookAppointment__c> listss=[select Name  from BookAppointment__c where Name=:id];
        
    
        if(listss.size()>0){
    for (BookAppointment__c b : listss) {
        b.Patient_Status__c=status;
        //b.PatientAvailability__c=patientAvailability;
    }
    
    update listss;
    return 'Success';
    
        }else{
            return 'Failure';
        }
    
    }
    
    
    @AuraEnabled
    public static List<BookAppointment__c> searchPatient(string name){
       
    string nameorphone='%'+name+'%';
    
    List<BookAppointment__c> listss=[select Name, Appointment_Date__c,Name__c,Mobile_Number__c,Email_Id__c,Speciality__c,Write_Reasons__c from BookAppointment__c where  Name__c like : nameorphone or Mobile_Number__c like : nameorphone ];
    
    return listss;
    
    }
    
    
    @AuraEnabled
    public static string verifyEmail(string email){
       
        List<BookAppointment__c> listss=[select Name, Appointment_Date__c,Name__c,Mobile_Number__c,Email_Id__c,Speciality__c,Write_Reasons__c from BookAppointment__c where Email_Id__c=:email ];
    
    if(listss.size()>0){
    
        //Send Otp to Email
    
        Integer randomPin   =(Integer) (Math.random()*9000)+1000;
            String otp  = String.valueOf(randomPin);
    
    
        Messaging.SingleEmailMessage mail=new Messaging.SingleEmailMessage();
        String [] emailId=new String[]{email};
        mail.setToAddresses(emailId);
        mail.setSubject('Your Otp is::'+otp);
        mail.setPlainTextBody('Hi ');
        messaging.sendEmail(new Messaging.SingleEmailMessage[]{mail});
       
    
    
        List<TwssOTP__c> otplists=[select Name from TwssOTP__c where Email__c=:email];
        if(otplists.size()>0){
    
            for (TwssOTP__c tp : otplists) {
                tp.Otp__c=otp; 
            }
            
            update otplists;
    
        }else{
    
    TwssOTP__c t=new TwssOTP__c();
    t.Email__c=email;
    t.Otp__c=otp;
    //t.CurrentDate__c=DateTime.now();
    
    insert t;
    
    
        }
    
       
    
    
    
    
    
    
    return 'Success';
    
    }else{
    
    return 'In-valid Email ';
    
    }
    
    
        
    
    }
    
    
    @AuraEnabled
    public static string verifyCotp(string email,string otp){
      
    List<TwssOTP__c> lists=[select Id, Name from TwssOTP__c where Email__c=:email and Otp__c=:otp];
    
    if(lists.size()>0){
    
        DateTime timeNow = System.now(); // Get the time now
        DateTime X1MinutesAgo = timeNow.addMinutes(-1); // Subtract 30 minutes from it
        
        List<TwssOTP__c> list1=[SELECT ID FROM TwssOTP__c WHERE LastModifiedDate <:timeNow AND LastModifiedDate >:X1MinutesAgo];
    
    if(list1.size()>0){
        return 'Success';
    }else{
        return 'OTP-EXPIRED';
    }
    
       
    
    
    
    
    
    }else{
        return 'INVALID-OTP';
    }
    
    
    }
    
    @AuraEnabled
    public static List<BookAppointment__c> getnameandmobile(string email){
        
    
    
    List<BookAppointment__c> lists=[select Name__c ,Mobile_Number__c from BookAppointment__c where Email_Id__c=:email];
    
    
    
    return lists;
    
    }
    
    // Reception Login
    
    @AuraEnabled
    public static List<Reception__c> receptionLogins(string email,string password){
       
        List<Reception__c> lists=[select Name, Username__c from Reception__c where Username__c=:email and Password__c=:password];
    
        return lists;
    
    }
    
    //get Out Patients
    
    @AuraEnabled
    public static List<BookAppointment__c> getOutpatients(){
       
    List<BookAppointment__c> lists=[select Name__c,Mobile_Number__c,Appointment_Date__c,Doctor__c,PatientAvailability__c,	Patient_Status__c from BookAppointment__c where PatientAvailability__c='Out-Patient'];
    
    return lists;
    }
    
    
    
    
    
    //get Out Patients
    
    @AuraEnabled
    public static List<BookAppointment__c> getInpatients(){
       
    List<BookAppointment__c> lists=[select Name__c,Mobile_Number__c,Appointment_Date__c,Doctor__c,PatientAvailability__c,	Patient_Status__c from BookAppointment__c where PatientAvailability__c='In-Patient'];
    
    return lists;
    }
    
    // Search Doctor
    @AuraEnabled
    public static string searchDoctor(string name){
       
    
    
    
        List<BookAppointment__c> lists1=[select Id, Name from BookAppointment__c where Doctor__c=:name];
    
    
        if(lists1.size()>0){
    
            List<BookAppointment__c> lists=[select Id, Name from BookAppointment__c where Doctor__c=:name and Appointment_Date__c=TODAY];
    
            if(lists.size()<4){
    
                return 'Slots Are Available';
            }else{
                return 'Slots Are Not Available';
            }
    
        }else{
    
            return 'Please Enter Doctor Name correctly!!!';
    
        }
    
        
    
       
    
    }
    
    
    
    // get Doctor Details from Doctor Object
    
    @AuraEnabled
    public static List<Doctor__c> getDescription(string name){
       
    List<Doctor__c> lists=[select Description__c,Specialist__c, Photo__c from Doctor__c where Doctor_Name__c=:name];
    
    return lists;
    
    }
    
    // Book an Appoinment
    
    @AuraEnabled
    public static string bookanappointment(BookAppointment__c key, string doctorname, string specialist){
       
        string name=String.valueOf(key.Name__c);
        string mobilenumber=String.valueOf(key.Mobile_Number__c);
        string emailid=String.valueOf(key.Email_Id__c);
        Date   appointmentdate=Date.valueOf(key.Appointment_Date__c);
        string reason=String.valueOf(key.Write_Reasons__c);
        string status=String.valueOf(key.Patient_Status__c);
        string availability=String.valueOf(key.PatientAvailability__c);
    
        BookAppointment__c b=new BookAppointment__c();
        b.Name__c=name;
        b.Mobile_Number__c=mobilenumber;
        b.Email_Id__c=emailid;
        b.Appointment_Date__c=appointmentdate;
        b.Write_Reasons__c=reason;
        b.Patient_Status__c=status;
        b.PatientAvailability__c=availability;
        b.Doctor__c=doctorname;
        b.Speciality__c=specialist;
    
    
    List<BookAppointment__c> lists=[Select id,Name from BookAppointment__c where Appointment_Date__c=:key.Appointment_Date__c and  Doctor__c=:key.Doctor__c];
    
    
    List<Leave__c> leavelists=[select Id, Name from Leave__c where Doctor_Name__c=:doctorname and Absent_Date__c=:appointmentdate];
    
    if(leavelists.size()>0){
    
        return 'Doctor Not Available';
    
    }else{
    
    
    
    
    if(lists.size()<3){
    
        insert b;
    
        Messaging.SingleEmailMessage mail=new Messaging.SingleEmailMessage();
        String [] emailIds=new String[]{emailid};
        mail.setToAddresses(emailIds);
        mail.setSubject('Your Appointment  is Booked');
        mail.setPlainTextBody('Your Appointment  is Successfully  Booked  and  Doctor Name:'+doctorname+' and  Appointment Date is:'+appointmentdate);
        messaging.sendEmail(new Messaging.SingleEmailMessage[]{mail});
       
    
    
    
    
        
        return b.Id;
    
    
    }else{
        return 'Slots Not Available'; 
    }
    
       // insert key;
    
    }
    }
    
    // Doctor Leave
       
    @AuraEnabled
    public static string doctorLeave(Leave__c key){
        
        insert key;
    
    Date leavedate=Date.valueOf(key.Absent_Date__c);
    string doctorname=String.valueOf(key.Doctor_Name__c);
    List<BookAppointment__c> lists=[select Id, Name,Email_Id__c from BookAppointment__c where Appointment_Date__c=:leavedate and Doctor__c=:doctorname];
    
    if(lists.size()>0){
    string email=lists[0].Email_Id__c;
    Date nextday = leavedate.addDays(1); 
        Messaging.SingleEmailMessage mail=new Messaging.SingleEmailMessage();
        String [] emailIds=new String[]{email};
        mail.setToAddresses(emailIds);
        mail.setSubject('Your Appointment Canceled ');
        mail.setPlainTextBody('Our Doctor is Absent  '+leavedate+'Your rescheduled date '+nextday);
        messaging.sendEmail(new Messaging.SingleEmailMessage[]{mail});
       
        for (BookAppointment__c b : lists) {
            
            
            b.Appointment_Date__c=nextday;
    
            update b;
        }
    
    }else{
    
    }
    
    
    
    
    
    return key.Id;
    
    }
        
    @AuraEnabled
    public static string checkAvailbilitytoday(string name){
       
        String status=null;
    
    List<Leave__c> lists=[select Id, Name from Leave__c where Doctor_Name__c=:name and Absent_Date__c=TODAY];
    
    if(lists.size()>0){
    
        status='Doctor Not Available Today!!';
    
    }else{
    
        List<BookAppointment__c> lists1=[Select id,Name from BookAppointment__c where  Doctor__c=:name and  Appointment_Date__c=TODAY];
    
        if(lists1.size()<3){
            status='Slots Available Today Please Book Now';
        }else{
            status='Slots Not Available Today !!!'; 
        }
    
    }
    
    return status;
    
    }   
    
    
    @AuraEnabled(cacheable=true)
        public static List<Doctor__c> getdoctordetails(string doctorname){
          
            
            List<Doctor__c> ls=[SELECT Name,Specialist__c,Mobile__c,Gender__c,Photo__c,Username__c from Doctor__c where Doctor_Name__c=:doctorname];
            return ls;
            
        }    
        
        @AuraEnabled(cacheable=true)
        public static List<BookAppointment__c> getdoctorappointment(string doctorname){
          
            
            List<BookAppointment__c> ls=[SELECT Name,Name__c,Appointment_Date__c,Write_Reasons__c,Doctor__c,PatientAvailability__c,Patient_Status__c, Email_Id__c, Mobile_Number__c from BookAppointment__c where Doctor__c=:doctorname and Appointment_Date__c>=TODAY and Patient_Status__c ='Pending'];
            return ls;
            
        }  
        
        @AuraEnabled
        public static String insertleavemethod(Leave__c key){
            insert key;
            return 'success';
            
        }
        
    @AuraEnabled
        public static String updatepwdmethod(String username, String oldpwd, String confirmpwd){
           
             List<Doctor__c> lis=[select id,Name from Doctor__c where Username__c=:username and Password__c=:oldpwd];
            if(lis.size()>0){
                for(Doctor__c d:lis){
                    d.Password__c = confirmpwd;
                }
                update lis;
                return 'success';
            }else{
               return 'failure';
            }
               
        }
    }
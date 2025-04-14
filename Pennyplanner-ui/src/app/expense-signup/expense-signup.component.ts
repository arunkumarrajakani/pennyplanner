import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../services/post.service';
import { Router } from '@angular/router';
import { IUser } from '../interface/IResponse';

@Component({
  selector: 'app-expense-signup',
  templateUrl: './expense-signup.component.html',
  styleUrls: ['./expense-signup.component.css']
})
export class ExpenseSignupComponent {

  constructor(private formBuilder: FormBuilder,private service:PostService,private router: Router){

  }
  
  fullName: FormControl;
  email:FormControl;
  password:FormControl;
  splitwiseKey:FormControl;
  getErrorMessageS: String = "Please enter a valid email"; 



  ngOnInit(){

    this.fullName= new FormControl('');
    this.email= new FormControl('', [Validators.required, Validators.email]);
    this.password= new FormControl('');
    this.splitwiseKey= new FormControl('');

    
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      this.getErrorMessageS = 'You must enter a value';
    }

    return this.email.hasError('email') ? this.getErrorMessageS='Not a valid email' : '';
  }



  onSubmit(){
    console.log(this.fullName.value);
    console.log(this.email.value);
    console.log(this.password.value);
    console.log(this.splitwiseKey.value);

    let validationError : string;
    validationError = "Please enter a valid ";
    let validationErrorExists: boolean = false;
    
    

    if(this.fullName.value == "" || this.fullName.value == null){
      validationError = validationError.concat(" full name,");
      validationErrorExists = true;
    }

    if(this.email.value == "" || this.email.value == null){
      validationError = validationError.concat(" email ,");
      validationErrorExists = true;

    }

    if(this.password.value == "" || this.password.value == null){
      validationError = validationError.concat(" password ,");
      validationErrorExists = true;
    }

    if(this.splitwiseKey.value == "" || this.splitwiseKey.value == null){
      validationError = validationError.concat(" splitwise key ,");
      validationErrorExists = true;
    }

    if(validationErrorExists){
      console.log(validationError.substring(0,validationError.length-1));
    }else{
      let userDetails:IUser={
        name:this.fullName.value,
        email:this.email.value,
        password:this.password.value,
        splitwise_key:this.splitwiseKey.value
      }

      this.service.createUser(userDetails).subscribe(x => {
        console.log("user created : "  + JSON.stringify(x));
        this.router.navigate(['./app-expense-login']);
      });
    }


  }

}

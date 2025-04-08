import { Component } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { IResponse } from '../interface/IResponse';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-expense-login',
  templateUrl: './expense-login.component.html',
  styleUrls: ['./expense-login.component.css']
})
export class ExpenseLoginComponent {

  posts:any;
  myGroup: FormGroup;
  loginError:String;


  constructor(private service:PostService,private formBuilder: FormBuilder,private router: Router) {}

  onSubmit() {
    const username = 'test';
    const password = 'test';
    
    this.service.authenticateUser<IResponse>(this.myGroup.value.username, this.myGroup.value.password).subscribe(res => {
       // console.log(res);
        if(res.responseStatus == "SUCCESS"){
          localStorage.setItem('user',JSON.stringify(res.responseBody.userId));
          this.router.navigate(['./app-expense-home']);
        }else{
          alert(res.responseMessage);
          this.router.navigate(['./app-expense-login']);
        }
    },
    (error =>{
      console.log("error is : " + JSON.stringify(error.error.responseMessage));
      this.loginError = error.error.responseMessage;
    })
    )

 }

  ngOnInit() {
    this.myGroup = this.formBuilder.group({
      'username': this.formBuilder.control(''),
      'password': this.formBuilder.control('')
    });

      // this.service.getPosts()

      //   .subscribe(response => {

      //     this.posts = response;
      //     console.log(this.posts);

      //   });

  }

}

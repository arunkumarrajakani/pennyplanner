import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { IExpense, ITransactionDetail, IUser } from '../interface/IResponse';



@Injectable()

export class PostService {

  private url = 'http://localhost:8082/v1/';

  private userContext = 'user/';
  private expenseContext = 'expense/';



  constructor(private httpClient: HttpClient) { }



  getPosts(){
    
    return this.httpClient.get(this.url);

  }

  authenticateUser<IResponse>(userName : String,password: String) {
     let finalUrl = this.url + this.userContext+ "authenticate";
     let User = {"email" : userName, "password":password};
     return this.httpClient.post<IResponse>(finalUrl,User);
  }

  createUser<IResponse>(userDetail : IUser){
    let finalUrl = this.url+this.userContext+"create";
    return this.httpClient.post<IResponse>(finalUrl,userDetail);
  }

  getUserDetails<IResponse>(userId : number){
    let finalUrl = this.url+this.expenseContext+'home/'+userId;
    return this.httpClient.get<IResponse>(finalUrl);
  }

  getAllTransactionDetails<IResponse>(userId : number){
    let finalUrl = this.url+this.expenseContext+'all/'+userId;
    return this.httpClient.get<IResponse>(finalUrl);
  }

  getTransactionDetailsByMonth<IResponse>(userId : number, monthId : String){
    let finalUrl = this.url+this.expenseContext+'month/'+userId + '/'+monthId;
    return this.httpClient.get<IResponse>(finalUrl);
  }

  createTransactionDetail<IResponse>(transactionDetail:ITransactionDetail){
    let finalUrl = this.url+this.expenseContext+"create";
    return this.httpClient.post<IResponse>(finalUrl,transactionDetail);
  }

  updateTransactionDetail<IResponse>(transactionDetail: ITransactionDetail){
    let finalUrl= this.url+this.expenseContext+'update';
    return this.httpClient.put<IResponse>(finalUrl,transactionDetail);

  }

  deleteTransactionDetail<IResponse>(transactionDetail: ITransactionDetail){
    let finalUrl = this.url+this.expenseContext+"delete";
    return this.httpClient.put<IResponse>(finalUrl,transactionDetail);
  }


}

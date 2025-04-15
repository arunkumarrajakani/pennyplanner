package com.backend.pennyplanner.controller;

import com.backend.pennyplanner.Model.ResponseModel;
import com.backend.pennyplanner.Repository.ExpenseRepository;
import com.backend.pennyplanner.Repository.UserRepository;
import com.backend.pennyplanner.entity.Expense;
import com.backend.pennyplanner.entity.TransactionObjects;
import com.backend.pennyplanner.entity.TransactionType;
import com.backend.pennyplanner.entity.User;
import com.backend.pennyplanner.service.ExpenseService;
import com.github.scribejava.core.model.Verb;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;
import java.math.BigInteger;
import java.text.DateFormat;
import java.util.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;

@CrossOrigin(
        origins = {
        		"http://localhost:4200",
        		"http://localhost:8080",
        		"https://c58c-68-66-175-202.ngrok-free.app"
        },
        methods = {
                RequestMethod.OPTIONS,
                RequestMethod.GET,
                RequestMethod.PUT,
                RequestMethod.DELETE,
                RequestMethod.POST
        })
@RestController
@RequestMapping("/v1/expense")
public class ExpenseController {
    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    ExpenseService expenseService;

    @PostMapping("/create")
    private ResponseEntity<ResponseModel<TransactionObjects>> createExpense(@RequestBody TransactionObjects transactionObject){
    	System.out.println(transactionObject.toString());
    	ResponseModel<TransactionObjects> responseModel = expenseService.createExpense(transactionObject);
    	return ResponseEntity.status(HttpStatus.OK).body(responseModel);
        
        
    }
    
    @PutMapping("/update")
    private ResponseEntity<ResponseModel<TransactionObjects>> updateExpense(@RequestBody TransactionObjects transactionObject){
    	System.out.println(transactionObject.toString());
    	ResponseModel<TransactionObjects> responseModel = expenseService.updateExpense(transactionObject);
    	return ResponseEntity.status(HttpStatus.OK).body(responseModel);
    }
    
    @PutMapping("/delete")
    private ResponseEntity<ResponseModel> deleteExpense(@RequestBody TransactionObjects transactionObject){
    	
    	System.out.println("Expense ID to be deleted : " + String.valueOf(transactionObject.getTransactionId()));
    	ResponseModel<String> responseModel = expenseService.deleteExpense(transactionObject);
    	
    	return ResponseEntity.status(HttpStatus.OK).body(responseModel);
    	
    }
    
    @GetMapping("/all/{id}")
    private ResponseEntity<ResponseModel> getExpenses(@PathVariable Integer id) throws Exception {

    	ResponseModel<List<TransactionObjects>> responseModel = expenseService.getAllExpenses(id);
    	
		return ResponseEntity.status(HttpStatus.OK).body(responseModel);
  
    }
    
    @GetMapping("/home/{id}")
    private ResponseEntity<ResponseModel> getCurrentMonthDetails(@PathVariable Integer id) throws Exception{

    	ResponseModel<List<TransactionObjects>> responseModel = expenseService.getCurrentMonthDetails(id);
		return ResponseEntity.status(HttpStatus.OK).body(responseModel);
    }
    
//    @GetMapping("/month/{id}/{monthId}")
//    private ResponseEntity<ResponseModel> getGivenMonthDetails(@PathVariable Integer id, @PathVariable Integer monthId) throws Exception{
//
//    	
//    	ResponseModel<List<TransactionObjects>> responseModel = expenseService.getGivenMonthDetails(id, monthId);
//    	
//		return ResponseEntity.status(HttpStatus.OK).body(responseModel);
//    }
}

package com.backend.pennyplanner.service;

import java.math.BigInteger;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.backend.pennyplanner.Model.ResponseModel;
import com.backend.pennyplanner.Repository.ExpenseRepository;
import com.backend.pennyplanner.Repository.UserRepository;
import com.backend.pennyplanner.entity.Expense;
import com.backend.pennyplanner.entity.TransactionObjects;
import com.backend.pennyplanner.entity.TransactionType;
import com.backend.pennyplanner.entity.User;

@Service
public class ExpenseService {
	
    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    SplitwiseService splitwiseService;
	
	public ResponseModel<TransactionObjects> createExpense(TransactionObjects transactionObject){
		
		User user = userRepository.getById(transactionObject.getUserId());
		if(user == null) {
			ResponseModel<TransactionObjects> responseModel = new ResponseModel<TransactionObjects>();
	    	responseModel.setHttpStatus(HttpStatus.BAD_REQUEST);
			responseModel.setResponseMessage("Unable to find the user to add the expense");
			responseModel.setResponseStatus("FAILED");
			responseModel.setResponseBody(null);
			return responseModel;
		}
    	
    	Expense expenseRecord = new Expense();
    	expenseRecord.setCategory("General");
    	expenseRecord.setCost(transactionObject.getTrasactionCost());
    	expenseRecord.setDetail(transactionObject.getTransactionDetail());
    	expenseRecord.setTransactionDate(transactionObject.getTransactionDate());
    	expenseRecord.setTransactionType(transactionObject.getTransactionType());
    	expenseRecord.setUser(user);
        
        Expense response = null;
    	try {
    		response = expenseRepository.save(expenseRecord);
    	}catch(Exception e) {
    		System.out.println(e.getMessage());
    	}
        
        if(response == null) {
			ResponseModel<TransactionObjects> responseModel = new ResponseModel<TransactionObjects>();
	    	responseModel.setHttpStatus(HttpStatus.INTERNAL_SERVER_ERROR);
			responseModel.setResponseMessage("Unable to create the expense, failed while saving to DB");
			responseModel.setResponseStatus("FAILED");
			responseModel.setResponseBody(null);
			return responseModel;
		}
        TransactionObjects transactionObjects = new TransactionObjects();
        transactionObjects.setTransactionDetail(response.getDetail());
        transactionObjects.setTransactionId(BigInteger.valueOf(response.getId().intValue()));
        transactionObjects.setTransactionDate(response.getTransactionDate());
        transactionObjects.setTransactionType(response.getTransactionType());
        transactionObjects.setTransactionCategory(response.getCategory());
        transactionObjects.setTrasactionCost(response.getCost());
        transactionObjects.setUserId(user.getUserId());
        transactionObjects.setTransactionSource("Expense App");
    	
    	ResponseModel<TransactionObjects> responseModel = new ResponseModel<TransactionObjects>();
    	responseModel.setHttpStatus(HttpStatus.OK);
		responseModel.setResponseMessage("Successfully saved transaction details");
		responseModel.setResponseStatus("SUCCESS");
		responseModel.setResponseBody(transactionObjects);
		
		return responseModel;
	}
	
	public ResponseModel<TransactionObjects> updateExpense(TransactionObjects transactionObject){
		User user = userRepository.getById(transactionObject.getUserId());
    	
		if(user == null) {
			ResponseModel<TransactionObjects> responseModel = new ResponseModel<TransactionObjects>();
	    	responseModel.setHttpStatus(HttpStatus.BAD_REQUEST);
			responseModel.setResponseMessage("Unable to find the user to add the expense");
			responseModel.setResponseStatus("FAILED");
			responseModel.setResponseBody(null);
			return responseModel;
		}
		
    	Expense expenseRecord = new Expense();
    	expenseRecord.setId(Integer.parseInt(String.valueOf(transactionObject.getTransactionId())));
    	expenseRecord.setCategory(transactionObject.getTransactionCategory());
    	expenseRecord.setCost(transactionObject.getTrasactionCost());
    	expenseRecord.setDetail(transactionObject.getTransactionDetail());
    	expenseRecord.setTransactionDate(transactionObject.getTransactionDate());
    	expenseRecord.setTransactionType(transactionObject.getTransactionType());
    	expenseRecord.setUser(user);
    	Expense response = null;
    	try {
    		response = expenseRepository.saveAndFlush(expenseRecord);
    	}catch(Exception e) {
    		System.out.println(e.getMessage());
    	}
    	if(response == null) {
			ResponseModel<TransactionObjects> responseModel = new ResponseModel<TransactionObjects>();
	    	responseModel.setHttpStatus(HttpStatus.INTERNAL_SERVER_ERROR);
			responseModel.setResponseMessage("Unable to update the expense, failed while saving to DB");
			responseModel.setResponseStatus("FAILED");
			responseModel.setResponseBody(null);
			return responseModel;
		}
    	TransactionObjects transactionObjects = new TransactionObjects();
        transactionObjects.setTransactionDetail(response.getDetail());
        transactionObjects.setTransactionId(BigInteger.valueOf(response.getId().intValue()));
        transactionObjects.setTransactionDate(response.getTransactionDate());
        transactionObjects.setTransactionType(response.getTransactionType());
        transactionObjects.setTransactionCategory(response.getCategory());
        transactionObjects.setTrasactionCost(response.getCost());
        transactionObjects.setUserId(user.getUserId());
        transactionObjects.setTransactionSource("Expense App");
    	
    	ResponseModel<TransactionObjects> responseModel = new ResponseModel<TransactionObjects>();
    	responseModel.setHttpStatus(HttpStatus.OK);
		responseModel.setResponseMessage("Successfully saved expense details");
		responseModel.setResponseStatus("SUCCESS");
		responseModel.setResponseBody(transactionObjects);
		
		return responseModel;
	}
	
	public ResponseModel<String> deleteExpense(TransactionObjects transactionObject){
		System.out.println("Expense ID to be deleted : " + String.valueOf(transactionObject.getTransactionId()));
		ResponseModel<String> responseModel = new ResponseModel<String>();
		try {
			expenseRepository.deleteById(Integer.parseInt(String.valueOf(transactionObject.getTransactionId())));
			responseModel.setHttpStatus(HttpStatus.OK);
			responseModel.setResponseMessage("Successfully deleted expense details");
			responseModel.setResponseStatus("SUCCESS");
			responseModel.setResponseBody("Deleted Expense");
		}catch(Exception e) {
			responseModel.setHttpStatus(HttpStatus.INTERNAL_SERVER_ERROR);
			responseModel.setResponseMessage("Failed to delete expense details with exception : "+ e.getMessage() );
			responseModel.setResponseStatus("FAILED");
			responseModel.setResponseBody(null);
		}    	
		return responseModel;
	}
	
	public ResponseModel<List<TransactionObjects>> getAllExpenses(Integer id) throws Exception{
		
		ResponseModel<List<TransactionObjects>> responseModel = new ResponseModel<List<TransactionObjects>>();
        User user = userRepository.getById(id);
        if(user == null) {			
	    	responseModel.setHttpStatus(HttpStatus.BAD_REQUEST);
			responseModel.setResponseMessage("Unable to find the user");
			responseModel.setResponseStatus("FAILED");
			responseModel.setResponseBody(null);
			return responseModel;
		}
        Date currentDate = new Date();
        int currentYear = currentDate.getYear();
        ResponseEntity<Object> spliwiseExpenses = null;
        List<LinkedHashMap> expensesList = new ArrayList<>();
        try {
            spliwiseExpenses = splitwiseService.getExpensesForUser(user);
             expensesList = (List<LinkedHashMap>) ((LinkedHashMap)spliwiseExpenses.getBody()).get("expenses");
           }catch(Exception e) {
           	System.out.println(e.getMessage());
           }
           List<TransactionObjects> transactionData = new ArrayList<>();
           for(LinkedHashMap expense : expensesList){
               TransactionObjects transactionObjects = new TransactionObjects();
               transactionObjects.setTransactionId(BigInteger.valueOf((Long) expense.get("id")));
               transactionObjects.setTransactionDetail((String) expense.get("description"));
               transactionObjects.setTransactionType(TransactionType.EXPENSE);
               final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX");
               transactionObjects.setTransactionDate(sdf.parse((String)expense.get("date")));
               if(!(sdf.parse((String)expense.get("date")).getYear() == currentYear)) {
            	   continue;
               }
               transactionObjects.setTrasactionCost(Double.valueOf( (String)expense.get("cost")));
               transactionObjects.setTransactionCategory((String) ((LinkedHashMap)expense.get("category")).get("name"));
               transactionObjects.setTransactionSource("Splitwise");
               transactionObjects.setUserId(user.getUserId());
               transactionData.add(transactionObjects);
           }
           List<Expense> expenses = new ArrayList<Expense>();
        try {
           expenses = expenseRepository.findByUserId(user.getUserId());
        }catch(Exception e) {
        	e.printStackTrace();
        }
        for(Expense expense : expenses){
        	if(!(expense.getTransactionDate().getYear() == currentYear)) {
        		continue;
        	}
            TransactionObjects transactionObjects = new TransactionObjects();
            transactionObjects.setTransactionDetail(expense.getDetail());
            transactionObjects.setTransactionId(BigInteger.valueOf(expense.getId().intValue()));
            transactionObjects.setTransactionDate(expense.getTransactionDate());
            transactionObjects.setTransactionType(expense.getTransactionType());
            transactionObjects.setTransactionCategory(expense.getCategory());
            transactionObjects.setTrasactionCost(expense.getCost());
            transactionObjects.setTransactionSource("Expense App");
            transactionObjects.setUserId(user.getUserId());
            transactionData.add(transactionObjects);
        }
        responseModel.setHttpStatus(HttpStatus.OK);
		responseModel.setResponseMessage("Successfully retrieved user details");
		responseModel.setResponseStatus("SUCCESS");
		responseModel.setResponseBody(transactionData);
		
		return responseModel;
	}
	
	public ResponseModel<List<TransactionObjects>> getCurrentMonthDetails(Integer id) throws Exception{
		
		ResponseModel<List<TransactionObjects>> responseModel = new ResponseModel<List<TransactionObjects>>();
        User user = userRepository.getById(id);
        if(user == null) {			
	    	responseModel.setHttpStatus(HttpStatus.BAD_REQUEST);
			responseModel.setResponseMessage("Unable to find the user");
			responseModel.setResponseStatus("FAILED");
			responseModel.setResponseBody(null);
			return responseModel;
		}
        Date currentDate = new Date();
        int currentMonth = currentDate.getMonth();
        System.out.println("currentmonth id : " + currentMonth);
        ResponseEntity<Object> spliwiseExpenses = null;
        List<LinkedHashMap> expensesList = new ArrayList<>();
        try {
            spliwiseExpenses = splitwiseService.getExpensesForUser(user);
             expensesList = (List<LinkedHashMap>) ((LinkedHashMap)spliwiseExpenses.getBody()).get("expenses");
           }catch(Exception e) {
           	System.out.println(e.getMessage());
           }
           List<TransactionObjects> transactionData = new ArrayList<>();
           for(LinkedHashMap expense : expensesList){
               TransactionObjects transactionObjects = new TransactionObjects();
               final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX");
               transactionObjects.setTransactionDate(sdf.parse((String)expense.get("date")));
               if(!(sdf.parse((String)expense.get("date")).getMonth() == currentMonth)) {
            	   continue;
               }
               if(transactionObjects.getTransactionDate().getYear() != currentDate.getYear()) {
            	   continue;
               }
               transactionObjects.setTransactionId(BigInteger.valueOf((Long) expense.get("id")));
               transactionObjects.setTransactionDetail((String) expense.get("description"));
               transactionObjects.setTransactionType(TransactionType.EXPENSE);               
               transactionObjects.setTrasactionCost(Double.valueOf( (String)expense.get("cost")));
               transactionObjects.setTransactionCategory((String) ((LinkedHashMap)expense.get("category")).get("name"));
               transactionObjects.setTransactionSource("Splitwise");
               transactionObjects.setUserId(user.getUserId());
               transactionData.add(transactionObjects);
           }
           List<Expense> expenses = new ArrayList<>();
           try {
        	   expenses = expenseRepository.findByUserId(user.getUserId());
           }catch(Exception e) {
        	   e.printStackTrace();
           }
           
        for(Expense expense : expenses){
        	if(!(expense.getTransactionDate().getMonth() == currentMonth)) {
        		continue;
        	}
            TransactionObjects transactionObjects = new TransactionObjects();
            transactionObjects.setTransactionDetail(expense.getDetail());
            transactionObjects.setTransactionId(BigInteger.valueOf(expense.getId().intValue()));
            transactionObjects.setTransactionDate(expense.getTransactionDate());
            transactionObjects.setTransactionType(expense.getTransactionType());
            transactionObjects.setTransactionCategory(expense.getCategory());
            transactionObjects.setTrasactionCost(expense.getCost());
            transactionObjects.setTransactionSource("Expense App");
            transactionObjects.setUserId(user.getUserId());
            transactionData.add(transactionObjects);
        }
        responseModel.setHttpStatus(HttpStatus.OK);
		responseModel.setResponseMessage("Successfully retrieved user details");
		responseModel.setResponseStatus("SUCCESS");
		responseModel.setResponseBody(transactionData);
		
		return responseModel;
	}
	
	public ResponseModel<List<TransactionObjects>> getGivenMonthDetails(Integer id, Integer monthId) throws Exception{
		ResponseModel<List<TransactionObjects>> responseModel = new ResponseModel<List<TransactionObjects>>();
        User user = userRepository.getById(id);
        if(user == null) {			
	    	responseModel.setHttpStatus(HttpStatus.BAD_REQUEST);
			responseModel.setResponseMessage("Unable to find the user");
			responseModel.setResponseStatus("FAILED");
			responseModel.setResponseBody(null);
			return responseModel;
		}
        System.out.println("month id : " + monthId);
        Date currentDate = new Date();
        ResponseEntity<Object> spliwiseExpenses = null;
        List<LinkedHashMap> expensesList = new ArrayList<>();
        try {
         spliwiseExpenses = splitwiseService.getExpensesForUser(user);
         System.out.println("spliwise expense obj : " + spliwiseExpenses);
          expensesList = (List<LinkedHashMap>) ((LinkedHashMap)spliwiseExpenses.getBody()).get("expenses");
        }catch(Exception e) {
        	System.out.println(e.getMessage());
        }
           List<TransactionObjects> transactionData = new ArrayList<>();
           for(LinkedHashMap expense : expensesList){
               TransactionObjects transactionObjects = new TransactionObjects();
               final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX");
               transactionObjects.setTransactionDate(sdf.parse((String)expense.get("date")));
               if((sdf.parse((String)expense.get("date")).getMonth() != (monthId-1))) {
            	   continue;
               }
               if(transactionObjects.getTransactionDate().getYear() != currentDate.getYear()) {
            	   continue;
               }
               transactionObjects.setTransactionId(BigInteger.valueOf((Long) expense.get("id")));
               transactionObjects.setTransactionDetail((String) expense.get("description"));
               transactionObjects.setTransactionType(TransactionType.EXPENSE);               
               transactionObjects.setTrasactionCost(Double.valueOf( (String)expense.get("cost")));
               transactionObjects.setTransactionCategory((String) ((LinkedHashMap)expense.get("category")).get("name"));
               transactionObjects.setTransactionSource("Splitwise");
               transactionObjects.setUserId(user.getUserId());
               transactionData.add(transactionObjects);
           }
           List<Expense> expenses = new ArrayList<>();
           try {
        	   expenses = expenseRepository.findByUserId(user.getUserId());
           }catch(Exception e) {
        	   e.printStackTrace();
           }
        
        for(Expense expense : expenses){
        	if((expense.getTransactionDate().getMonth() != (monthId-1))) {
        		continue;
        	}
            TransactionObjects transactionObjects = new TransactionObjects();
            transactionObjects.setTransactionDetail(expense.getDetail());
            transactionObjects.setTransactionId(BigInteger.valueOf(expense.getId().intValue()));
            transactionObjects.setTransactionDate(expense.getTransactionDate());
            transactionObjects.setTransactionType(expense.getTransactionType());
            transactionObjects.setTransactionCategory(expense.getCategory());
            transactionObjects.setTrasactionCost(expense.getCost());
            transactionObjects.setTransactionSource("Expense App");
            transactionObjects.setUserId(user.getUserId());
            transactionData.add(transactionObjects);
        }
        responseModel.setHttpStatus(HttpStatus.OK);
		responseModel.setResponseMessage("Successfully retrieved user details");
		responseModel.setResponseStatus("SUCCESS");
		responseModel.setResponseBody(transactionData);
		return responseModel;
	}
}

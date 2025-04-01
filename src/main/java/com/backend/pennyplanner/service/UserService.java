package com.backend.expense.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.backend.expense.Model.ResponseModel;
import com.backend.expense.Repository.UserRepository;
import com.backend.expense.entity.User;
import com.backend.expense.utils.SplitwiseClient;

@Service
public class UserService {
	
	@Autowired
    private UserRepository userRepository;
	
	public ResponseEntity<ResponseModel<User>> getUser(Integer id) {
		ResponseModel<User> responseModel = new ResponseModel();
        //String response = splitwiseClient.makeRequest(Endpoints.GET_GROUPS, Verb.GET);
        Optional<User> users = userRepository.findById(id);
        if(users.isPresent()) {
        	responseModel.setHttpStatus(HttpStatus.OK);
    		responseModel.setResponseMessage("Found User");
    		responseModel.setResponseStatus("SUCCESS");
    		responseModel.setResponseBody(users.get());
    		return ResponseEntity.status(HttpStatus.OK).body(responseModel);
    	}else {
    		responseModel.setHttpStatus(HttpStatus.BAD_REQUEST);
    		responseModel.setResponseMessage("Invalid Id provided");
    		responseModel.setResponseStatus("FAILURE");
    		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseModel);
    	}
	}
	
	public ResponseModel<User> createUser(User user){
		
		ResponseModel<User> responseModel = new ResponseModel();
		if(user == null) {
			 responseModel.setHttpStatus(HttpStatus.BAD_REQUEST);
			 responseModel.setResponseMessage("Failed to create User, no info found");
			 responseModel.setResponseStatus("FAILED");
			 responseModel.setResponseBody(null);
			 return responseModel;
		}
        User res = userRepository.save(user);
        responseModel.setHttpStatus(HttpStatus.OK);
		responseModel.setResponseMessage("Successfully Created User");
		responseModel.setResponseStatus("SUCCESS");
		responseModel.setResponseBody(res);
		return responseModel;
	}
	
	public ResponseEntity<ResponseModel<User>> authenticateUser(User user){
		
		ResponseModel<User> responseModel = new ResponseModel();
    	List<User> input = userRepository.findByEmail(user.getEmail());
    	if(input.size() > 0 && input.get(0).getPassword().equals(user.getPassword())) {
    		
    		responseModel.setHttpStatus(HttpStatus.OK);
    		responseModel.setResponseMessage("Successfully Authenticated");
    		responseModel.setResponseStatus("SUCCESS");
    		responseModel.setResponseBody(input.get(0));
    		return ResponseEntity.status(HttpStatus.OK).body(responseModel);
    	}else {
    		responseModel.setHttpStatus(HttpStatus.UNAUTHORIZED);
    		responseModel.setResponseMessage("Invalid Username/Password Provided");
    		responseModel.setResponseStatus("FAILURE");
    		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseModel);
    	}
		
		
	}

}

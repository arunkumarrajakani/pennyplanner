package com.backend.pennyplanner.controller;

import com.backend.pennyplanner.Model.ResponseModel;
import com.backend.pennyplanner.Repository.UserRepository;
import com.backend.pennyplanner.constants.Endpoints;
import com.backend.pennyplanner.entity.User;
import com.backend.pennyplanner.service.UserService;
import com.github.scribejava.core.model.Verb;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;


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
@RequestMapping("/v1/user")

public class UserController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/all")
    private ResponseEntity<ResponseModel<User>> getUser(@RequestParam Integer userId) throws Exception {
    	ResponseEntity<ResponseModel<User>> response = userService.getUser(userId);
        return response;
    }

    @PostMapping("/create")
    private ResponseEntity<ResponseModel<User>> createUser(@RequestBody User user) throws Exception {
    	ResponseModel<User> responseModel = userService.createUser(user);
    	
		return ResponseEntity.status(HttpStatus.OK).body(responseModel);
    }
    
    @PostMapping("/authenticate")
    private ResponseEntity<ResponseModel<User>> authenticateUser(@RequestBody User user) throws Exception{
    	ResponseEntity<ResponseModel<User>>responseModel = userService.authenticateUser(user);
    	return responseModel;
  	   	
    }
}

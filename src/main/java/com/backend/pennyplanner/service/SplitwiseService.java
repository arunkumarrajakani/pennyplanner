package com.backend.pennyplanner.service;

import com.backend.pennyplanner.constants.Endpoints;
import com.backend.pennyplanner.entity.User;
import com.backend.pennyplanner.utils.SplitwiseClient;
import com.github.scribejava.core.model.Verb;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class SplitwiseService {
    SplitwiseClient splitwiseClient = new SplitwiseClient();

    public ResponseEntity<Object> getExpensesForUser(User user) throws Exception {
        return splitwiseClient.makeRequest(Endpoints.GET_EXPENSES, Verb.GET, user.getSplitwise_key());
    }

}

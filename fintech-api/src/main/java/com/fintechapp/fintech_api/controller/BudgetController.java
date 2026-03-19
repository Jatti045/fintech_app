package com.fintechapp.fintech_api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;
import jakarta.validation.Valid;

import com.fintechapp.fintech_api.dto.budget.BudgetDataResponse;
import com.fintechapp.fintech_api.dto.budget.BudgetIdResponse;
import com.fintechapp.fintech_api.dto.budget.BudgetsResponse;
import com.fintechapp.fintech_api.dto.budget.CreateBudgetRequest;
import com.fintechapp.fintech_api.dto.budget.UpdateBudgetRequest;
import com.fintechapp.fintech_api.dto.auth.AuthenticatedUser;
import com.fintechapp.fintech_api.service.BudgetService;

@RestController
@RequestMapping({ "/api/budgets", "/api/budget" })
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BudgetDataResponse createBudget(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @Valid @RequestBody CreateBudgetRequest request) {
        return budgetService.createBudget(authenticatedUser, request);
    }

    @GetMapping
    public BudgetsResponse getBudgets(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @RequestParam(required = false) String month,
            @RequestParam(required = false) String year) {
        return budgetService.getBudgets(authenticatedUser, month, year);
    }

    @DeleteMapping("/{budgetId}")
    public BudgetIdResponse deleteBudget(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @PathVariable String budgetId) {
        return budgetService.deleteBudget(authenticatedUser, budgetId);
    }

    @RequestMapping(value = "/{budgetId}", method = {RequestMethod.PATCH, RequestMethod.PUT})
    public BudgetDataResponse updateBudget(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @PathVariable String budgetId,
            @Valid @RequestBody UpdateBudgetRequest request) {
        return budgetService.updateBudget(authenticatedUser, budgetId, request);
    }
}

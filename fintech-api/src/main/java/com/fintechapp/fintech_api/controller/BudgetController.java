package com.fintechapp.fintech_api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
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

    @PatchMapping("/{budgetId}")
    public BudgetDataResponse updateBudget(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @PathVariable String budgetId,
            @Valid @RequestBody UpdateBudgetRequest request) {
        return budgetService.updateBudget(authenticatedUser, budgetId, request);
    }
}

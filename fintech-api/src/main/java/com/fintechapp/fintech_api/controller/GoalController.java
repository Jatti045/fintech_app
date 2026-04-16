package com.fintechapp.fintech_api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import com.fintechapp.fintech_api.dto.auth.AuthenticatedUser;
import com.fintechapp.fintech_api.dto.goal.AllocateGoalRequest;
import com.fintechapp.fintech_api.dto.goal.CreateGoalRequest;
import com.fintechapp.fintech_api.dto.goal.GoalDataResponse;
import com.fintechapp.fintech_api.dto.goal.GoalIdResponse;
import com.fintechapp.fintech_api.dto.goal.GoalsResponse;
import com.fintechapp.fintech_api.dto.goal.UpdateGoalRequest;
import com.fintechapp.fintech_api.service.GoalService;

@RestController
@RequestMapping({ "/api/goals", "/api/goal" })
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping
    public GoalsResponse getGoals(@AuthenticationPrincipal AuthenticatedUser authenticatedUser,
                                  @RequestParam(required = false) String month,
                                  @RequestParam(required = false) String year)  {
        return goalService.getGoals(authenticatedUser, month, year);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GoalDataResponse createGoal(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @Valid @RequestBody CreateGoalRequest request) {
        return goalService.createGoal(authenticatedUser, request);
    }

    @PatchMapping("/{goalId}")
    public GoalDataResponse updateGoal(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @PathVariable String goalId,
            @Valid @RequestBody UpdateGoalRequest request) {
        return goalService.updateGoal(authenticatedUser, goalId, request);
    }

    @PostMapping("/{goalId}/allocate")
    public GoalDataResponse allocateToGoal(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @PathVariable String goalId,
            @Valid @RequestBody AllocateGoalRequest request) {
        return goalService.allocateToGoal(authenticatedUser, goalId, request);
    }

    @PostMapping("/{goalId}/deallocate")
    public GoalDataResponse deallocateFromGoal(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @PathVariable String goalId,
            @Valid @RequestBody AllocateGoalRequest request) {
        return goalService.deallocateFromGoal(authenticatedUser, goalId, request);
    }

    @DeleteMapping("/{goalId}")
    public GoalIdResponse deleteGoal(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @PathVariable String goalId) {
        return goalService.deleteGoal(authenticatedUser, goalId);
    }
}

package com.fintechapp.fintech_api.integration.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.fintechapp.fintech_api.integration.support.BaseIntegrationTest;
import com.fintechapp.fintech_api.model.Goal;
import com.fintechapp.fintech_api.model.GoalAllocation;
import com.fintechapp.fintech_api.model.User;
import com.fintechapp.fintech_api.repository.GoalAllocationRepository;

class GoalControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private GoalAllocationRepository goalAllocationRepository;

    @Test
    void deallocateFromGoal_validRequest_reducesProgressAndStoresNegativeAllocation() throws Exception {
        User user = createUser("goal-deallocate@example.com", "Password123!", "goal-deallocate");
        Goal goal = createGoal(user, 1000, 300, "travel");

        mockMvc.perform(post("/api/goals/{goalId}/deallocate", goal.getId())
                        .header(authHeaderName(), authHeader(user))
                        .contentType(json())
                        .content(asJson(Map.of("amount", 120.0))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(goal.getId()))
                .andExpect(jsonPath("$.data.progress").value(180.0));

        Goal updated = goalRepository.findById(goal.getId()).orElseThrow();
        org.junit.jupiter.api.Assertions.assertEquals(180.0, updated.getProgress());

        GoalAllocation ledgerEntry = goalAllocationRepository.findAll().stream()
                .filter(allocation -> allocation.getGoal() != null && goal.getId().equals(allocation.getGoal().getId()))
                .findFirst()
                .orElseThrow();
        org.junit.jupiter.api.Assertions.assertEquals(-120.0, ledgerEntry.getAmount());
    }

    @Test
    void deallocateFromGoal_amountGreaterThanProgress_returnsBadRequest() throws Exception {
        User user = createUser("goal-deallocate-over@example.com", "Password123!", "goal-deallocate-over");
        Goal goal = createGoal(user, 500, 100, "car");

        mockMvc.perform(post("/api/goals/{goalId}/deallocate", goal.getId())
                        .header(authHeaderName(), authHeader(user))
                        .contentType(json())
                        .content(asJson(Map.of("amount", 150.0))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Deallocation amount cannot exceed current goal progress"));
    }

    @Test
    void deallocateFromGoal_unknownGoal_returnsNotFound() throws Exception {
        User user = createUser("goal-deallocate-missing@example.com", "Password123!", "goal-deallocate-missing");

        mockMvc.perform(post("/api/goals/{goalId}/deallocate", "missing-goal-id")
                        .header(authHeaderName(), authHeader(user))
                        .contentType(json())
                        .content(asJson(Map.of("amount", 50.0))))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void deallocateFromGoal_invalidAmount_returnsBadRequest() throws Exception {
        User user = createUser("goal-deallocate-invalid@example.com", "Password123!", "goal-deallocate-invalid");
        Goal goal = createGoal(user, 500, 100, "car");

        mockMvc.perform(post("/api/goals/{goalId}/deallocate", goal.getId())
                        .header(authHeaderName(), authHeader(user))
                        .contentType(json())
                        .content(asJson(Map.of("amount", 0))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void deallocateFromGoal_noToken_returnsUnauthorized() throws Exception {
        mockMvc.perform(post("/api/goals/{goalId}/deallocate", "any-goal-id")
                        .contentType(json())
                        .content(asJson(Map.of("amount", 10.0))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }
}


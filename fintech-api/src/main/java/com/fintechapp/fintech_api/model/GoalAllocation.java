package com.fintechapp.fintech_api.model;

import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Index;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "goal_allocations", indexes = {
        @Index(name = "idx_goal_allocations_user_allocated_at", columnList = "user_id,allocated_at"),
        @Index(name = "idx_goal_allocations_goal", columnList = "goal_id")
})
@Getter
@Setter
@NoArgsConstructor
public class GoalAllocation {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(nullable = false, updatable = false, length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goal_id")
    private Goal goal;

    @Column(nullable = false)
    private double amount;

    @CreationTimestamp
    @Column(name = "allocated_at", nullable = false, updatable = false)
    private Instant allocatedAt;
}

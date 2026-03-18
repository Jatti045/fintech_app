package com.fintechapp.fintech_api.model;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(nullable = false, updatable = false, length = 36)
    private String id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String username;

    @Column(name = "profile_pic")
    private String profilePic;

    @Column(name = "profile_pic_public_id")
    private String profilePicPublicId;

    @Column(nullable = false)
    private String currency = "USD";

    @Column(name = "monthly_income", nullable = false)
    private double monthlyIncome = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "user")
    private Set<Transaction> transactions = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<Budget> budgets = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<PasswordResetToken> passwordResets = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<Goal> goals = new HashSet<>();
}

package com.fintechapp.fintech_api.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.fintechapp.fintech_api.model.Transaction;
import com.fintechapp.fintech_api.model.TransactionType;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository
        extends JpaRepository<Transaction, String>, JpaSpecificationExecutor<Transaction> {

    Optional<Transaction> findByIdAndUser_Id(String id, String userId);

    List<Transaction> findByUser_IdOrderByDateDesc(String userId);

    List<Transaction> findByUser_IdAndTypeOrderByDateDesc(String userId, TransactionType type);

    List<Transaction> findByBudget_IdOrderByDateDesc(String budgetId);

    List<Transaction> findByGoal_IdOrderByDateDesc(String goalId);

    List<Transaction> findByUser_IdAndDateBetweenOrderByDateDesc(String userId, Instant from, Instant to);

    long countByBudget_IdAndUser_Id(String budgetId, String userId);

    long countByGoal_IdAndUser_Id(String goalId, String userId);

    long deleteByUser_Id(String userId);
}

package com.fintechapp.fintech_api.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fintechapp.fintech_api.model.Goal;
import org.springframework.stereotype.Repository;

@Repository
public interface GoalRepository extends JpaRepository<Goal, String> {

    List<Goal> findByUser_Id(String userId);

    List<Goal> findByUser_IdOrderByCreatedAtDesc(String userId);

    Optional<Goal> findByIdAndUser_Id(String id, String userId);

    long deleteByUser_Id(String userId);

    List<Goal> findByUser_IdAndCreatedAtGreaterThanEqualAndCreatedAtLessThanOrderByUpdatedAtDesc(String userId, Instant from, Instant to);
}

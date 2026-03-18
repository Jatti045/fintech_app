package com.fintechapp.fintech_api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fintechapp.fintech_api.model.User;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}


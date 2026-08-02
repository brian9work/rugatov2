package com.goodai.rugato.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.goodai.rugato.model.TestModel;

@Repository
public interface iTestRepository extends JpaRepository<TestModel, Integer> {
    // Additional query methods can be defined here if needed

}

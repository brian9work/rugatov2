package com.goodai.rugato.repository;

import com.goodai.rugato.model.BuildsModel;
import com.goodai.rugato.model.ExtrasModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface iBuildsRepository extends JpaRepository<BuildsModel, Integer> {
    List<BuildsModel> findByMenuId(Integer menu_id);
}

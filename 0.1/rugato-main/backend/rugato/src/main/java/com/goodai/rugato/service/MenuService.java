package com.goodai.rugato.service;

import com.goodai.rugato.dto.BuildsDTO;
import com.goodai.rugato.dto.ExtrasDTO;
import com.goodai.rugato.dto.IngredientsDTO;
import com.goodai.rugato.model.BuildsModel;
import com.goodai.rugato.model.ExtrasModel;
import com.goodai.rugato.model.IngredientsModel;
import com.goodai.rugato.repository.iBuildsRepository;
import com.goodai.rugato.repository.iExtrasRepository;
import com.goodai.rugato.repository.iIngredientsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.goodai.rugato.dto.MenuDTO;
import com.goodai.rugato.model.MenuModel;
import com.goodai.rugato.repository.iMenuRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuService {
    @Autowired
    private final iMenuRepository MenuRepository;
    private final iExtrasRepository ExtrasRepository;
    private final iBuildsRepository BuildsRespository;
    private final iIngredientsRepository IngredientsRepository;

    public MenuService(iMenuRepository MenuRepository, iExtrasRepository extrasRepository, iBuildsRepository buildsRespository, iIngredientsRepository ingredientsRepository) {
        this.MenuRepository = MenuRepository;
        this.ExtrasRepository = extrasRepository;
        this.BuildsRespository = buildsRespository;
        this.IngredientsRepository = ingredientsRepository;
    }

    public List<MenuDTO> getAllMenu() {
        return MenuRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public List<MenuDTO> getAllMenuByCategory(Integer category) {

        return MenuRepository.getByCategory(category)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public MenuDTO getMenuTest(Integer id) {

        return MenuRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("producto no encontrado"));
    }

    public MenuDTO toDTO(MenuModel menu) {
        MenuDTO dto = new MenuDTO();
        dto.setId(menu.getId());
        dto.setName(menu.getName());
        dto.setCategory_id(menu.getCategory_id());
        dto.setPrice(menu.getPrice());
        dto.setPrice_ch(menu.getPrice_ch());
        dto.setPrice_med(menu.getPrice_med());
        dto.setPrice_gde(menu.getPrice_gde());
        dto.setDescription(menu.getDescription());

        // Ingredients
        dto.setIngredients(
                IngredientsRepository.findByMenuId(menu.getId())
                        .stream()
                        .map(i -> new IngredientsDTO(i.getId(), i.getName()))
                        .toList()
        );

        // Extras
        dto.setExtras(
                ExtrasRepository.findByMenuId(menu.getId())
                        .stream()
                        .map(e -> new ExtrasDTO(e.getId(), e.getName(), e.getPrice()))
                        .toList()
        );

        // Builds
        dto.setBuilds(
                BuildsRespository.findByMenuId(menu.getId())
                        .stream()
                        .map(b -> new BuildsDTO(b.getId(), b.getName(),
                                b.getIngredients()
                                        .stream()
                                        .map(IngredientsModel::getName)
                                        .toList()))
                        .toList()
        );

        return dto;
    }

}

package com.goodai.rugato.service;

import com.goodai.rugato.dto.*;
import com.goodai.rugato.model.*;
import com.goodai.rugato.repository.iIngredientsRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class MenuMapper {

    private final iIngredientsRepository ingredientsRepository;

    public MenuMapper(iIngredientsRepository ingredientsRepository) {
        this.ingredientsRepository = ingredientsRepository;
    }

    // -------------------- MENU --------------------
    public MenuDTO toDTO(MenuModel menu, List<IngredientsDTO> ingredients,
                         List<ExtrasDTO> extras, List<BuildsDTO> builds) {
        MenuDTO dto = new MenuDTO();
        dto.setId(menu.getId());
        dto.setName(menu.getName());
        dto.setCategory_id(menu.getCategory_id());
        dto.setPrice(menu.getPrice());
        dto.setPrice_ch(menu.getPrice_ch());
        dto.setPrice_med(menu.getPrice_med());
        dto.setPrice_gde(menu.getPrice_gde());
        dto.setDescription(menu.getDescription());
        dto.setIngredients(ingredients);
        dto.setExtras(extras);
        dto.setBuilds(builds);
        dto.setIs_active(menu.getIs_active());
        return dto;
    }

    public MenuDTO toDTOOnly(MenuModel menu) {
        MenuDTO dto = new MenuDTO();
        dto.setId(menu.getId());
        dto.setName(menu.getName());
        dto.setCategory_id(menu.getCategory_id());
        dto.setPrice(menu.getPrice());
        dto.setPrice_ch(menu.getPrice_ch());
        dto.setPrice_med(menu.getPrice_med());
        dto.setPrice_gde(menu.getPrice_gde());
        dto.setDescription(menu.getDescription());
        dto.setIs_active(menu.getIs_active());
        return dto;
    }

    public MenuModel toModel(MenuDTO dto) {
        MenuModel menu = new MenuModel();
        menu.setId(dto.getId());
        menu.setCategory_id(dto.getCategory_id());
        menu.setName(dto.getName());
        menu.setPrice(dto.getPrice());
        menu.setPrice_ch(dto.getPrice_ch());
        menu.setPrice_med(dto.getPrice_med());
        menu.setPrice_gde(dto.getPrice_gde());
        menu.setDescription(dto.getDescription());
        menu.setIs_active(dto.getIs_active());
        return menu;
    }

    // -------------------- INGREDIENTS --------------------
    public IngredientsDTO toDTO(IngredientsModel model) {
        IngredientsDTO dto = new IngredientsDTO();
        dto.setId(model.getId());
        dto.setName(model.getName());
        dto.setCategory_id(model.getCategory_id());
        dto.setIs_active(model.getIs_active());
        if (model.getMenu() != null) {
            dto.setMenu_id(model.getMenu().getId());
        }
        return dto;
    }

    public IngredientsModel toModel(IngredientsDTO dto, MenuModel menu) {
        IngredientsModel ing = new IngredientsModel();
        ing.setId(dto.getId());
        ing.setName(dto.getName());
        ing.setCategory_id(dto.getCategory_id());
        ing.setIs_active(dto.getIs_active());
        ing.setMenu(menu);
        return ing;
    }

    // -------------------- EXTRAS --------------------
    public ExtrasDTO toDTO(ExtrasModel model) {
        ExtrasDTO dto = new ExtrasDTO();
        dto.setId(model.getId());
        dto.setName(model.getName());
        dto.setPrice(model.getPrice());
        dto.setIs_active(model.getIs_active());
        if (model.getMenu() != null) {
            dto.setMenu_id(model.getMenu().getId());
        }
        return dto;
    }

    public ExtrasModel toModel(ExtrasDTO dto, MenuModel menu) {
        ExtrasModel ext = new ExtrasModel();
        ext.setId(dto.getId());
        ext.setName(dto.getName());
        ext.setPrice(dto.getPrice());
        ext.setIs_active(dto.getIs_active());
        ext.setMenu(menu);
        return ext;
    }

    // -------------------- BUILDS --------------------
    public BuildsDTO toDTO(BuildsModel model) {
        BuildsDTO dto = new BuildsDTO();
        dto.setId(model.getId());
        dto.setName(model.getName());
        dto.setQuantity_md(model.getQuantity_md());
        dto.setQuantity_gr(model.getQuantity_gr());
        dto.setMaximo(model.getMaximo());
        dto.setIngredientsList(model.getIngredients_list());

        if (model.getMenu() != null) {
            dto.setMenu_id(model.getMenu().getId());
        }

        if (model.getIngredients() != null) {
            dto.setIngredientIds(
                    model.getIngredients().stream()
                            .map(IngredientsModel::getId)
                            .collect(Collectors.toList())
            );
            dto.setIngredientNames(
                    model.getIngredients().stream()
                            .map(IngredientsModel::getName)
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }

    public BuildsModel toModel(BuildsDTO dto, MenuModel menu) {
        BuildsModel model = new BuildsModel();
        model.setId(dto.getId());
        model.setName(dto.getName());
        model.setQuantity_md(dto.getQuantity_md());
        model.setQuantity_gr(dto.getQuantity_gr());
        model.setMenu(menu);
        model.setIngredients_list(dto.getIngredientsList());
        model.setMaximo(dto.getMaximo());

        if (dto.getIngredientIds() != null && !dto.getIngredientIds().isEmpty()) {
            List<IngredientsModel> ingredients = ingredientsRepository.findAllById(dto.getIngredientIds());
            model.setIngredients(ingredients);
        }
        return model;
    }
}

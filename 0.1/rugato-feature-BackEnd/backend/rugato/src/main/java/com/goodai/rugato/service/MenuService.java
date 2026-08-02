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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.goodai.rugato.dto.MenuDTO;
import com.goodai.rugato.model.MenuModel;
import com.goodai.rugato.repository.iMenuRepository;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.awt.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
public class MenuService {

    private final iMenuRepository menuRepository;
    private final iExtrasRepository extrasRepository;
    private final iBuildsRepository buildsRepository;
    private final iIngredientsRepository ingredientsRepository;
    private final MenuMapper mapper;

    @Autowired
    public MenuService(iMenuRepository menuRepository,
                       iExtrasRepository extrasRepository,
                       iBuildsRepository buildsRepository,
                       iIngredientsRepository ingredientsRepository,
                       MenuMapper mapper) {
        this.menuRepository = menuRepository;
        this.extrasRepository = extrasRepository;
        this.buildsRepository = buildsRepository;
        this.ingredientsRepository = ingredientsRepository;
        this.mapper = mapper;
    }
    // ---------------------- Get Components -------------------------------

    public List<MenuDTO> getMenuWithBuilds() {
        System.out.println("cargando");
        return menuRepository.findAll()
                .stream()
                .map(this::mapFullMenu)
                .toList();
    }

    public MenuDTO getMenuById(Integer id) {
        Optional<MenuModel> menu = menuRepository.findById(id);
        if (menu.isPresent()) {
            return mapFullMenu(menu.get());
        }
        throw new RuntimeException("Menu no encontrado con id: " + id);
    }

    public List<MenuDTO> getOnlyMenu() {
        return menuRepository.findAll()
                .stream()
                .map(mapper::toDTOOnly)
                .toList();
    }

    public List<MenuDTO> getAllMenuByCategory(Integer category) {
        return menuRepository.getByCategory(category)
                .stream()
                .map(this::mapFullMenu)
                .toList();
    }
    public List<MenuDTO> getAllMenuActive(){
        return menuRepository.findByStatusMenu(1)
                .stream()
                .map(this::mapFullMenu)
                .toList();
    }
    public List<MenuDTO> getOnlyMenuActive(){
        return menuRepository.findByStatusMenu(1)
                .stream()
                .map(mapper::toDTOOnly)
                .toList();
    }
    public List<MenuDTO>getAllMenuByCategoryActive(Integer category){
        return menuRepository.getByCategoryActive(category,1)
                .stream()
                .map(this::mapFullMenu)
                .toList();
    }

    // ----------------------- Add Components ----------------------

    public MenuDTO addMenu(MenuDTO menuDto) {
        if (menuDto.getIs_active() == null) {
            menuDto.setIs_active(1);
        }
        MenuModel menu = mapper.toModel(menuDto);
        MenuModel saved = menuRepository.save(menu);
        return mapper.toDTOOnly(saved);
    }

    public IngredientsDTO addIngredients(IngredientsDTO ingredientDto) {
        if (ingredientDto.getIs_active() == null) {
            ingredientDto.setIs_active(1);
        }
        MenuModel menu = null;
        if (ingredientDto.getMenu_id() != null) {
            menu = menuRepository.findById(ingredientDto.getMenu_id())
                    .orElseThrow(() -> new RuntimeException("Menu no encontrado"));
        }
        IngredientsModel ing = mapper.toModel(ingredientDto, menu);
        return mapper.toDTO(ingredientsRepository.save(ing));
    }

    public ExtrasDTO addExtras(ExtrasDTO extrasDto) {
        if (extrasDto.getIs_active() == null) {
            extrasDto.setIs_active(1);
        }
        MenuModel menu = null;
        if (extrasDto.getMenu_id() != null) {
            menu = menuRepository.findById(extrasDto.getMenu_id())
                    .orElseThrow(() -> new RuntimeException("Menu no encontrado"));
        }
        ExtrasModel ext = mapper.toModel(extrasDto, menu);
        return mapper.toDTO(extrasRepository.save(ext));
    }

    public BuildsDTO addBuilds(BuildsDTO buildDto) {
        MenuModel menu = null;
        if (buildDto.getMenu_id() != null) {
            menu = menuRepository.findById(buildDto.getMenu_id())
                    .orElseThrow(() -> new RuntimeException("Menu no encontrado"));
        }
        BuildsModel model = mapper.toModel(buildDto, menu);
        return mapper.toDTO(buildsRepository.save(model));
    }

    public MenuDTO getMenuTest(Integer id) {
        return menuRepository.findById(id)
                .map(this::mapFullMenu)
                .orElseThrow(() -> new RuntimeException("producto no encontrado"));
    }
    //----------------------Update Components ------------------------

    public MenuDTO updateMenu(int id, MenuDTO menu){
        MenuModel MenuExist = findMenuOrThrow(id,"Menu");
        updateFieldsMenu(MenuExist, menu);
        MenuModel saveMenu = menuRepository.save(MenuExist);
        return mapper.toDTOOnly(saveMenu);
    }

    public BuildsDTO updateBuidls(int id, BuildsDTO build){
        BuildsModel BuidlsExist = findBuildOrThrow(id,"Build");
        updateFieldsBuidls(BuidlsExist, build);
        BuildsModel saveBuidls = buildsRepository.save(BuidlsExist);
        return mapper.toDTO(saveBuidls);
    }

    public IngredientsDTO updateIngredients(int id, IngredientsDTO ingredient){
        IngredientsModel IngredientsExist = findIngredientsOrThrow(id, "Ingredient");
        updateFieldIngrdients(IngredientsExist, ingredient);
        IngredientsModel saveIngrendients = ingredientsRepository.save(IngredientsExist);
        return mapper.toDTO(saveIngrendients);
    }

    public ExtrasDTO updateExtras (int id, ExtrasDTO extra ){
        ExtrasModel ExtrasExisting = findExtrasOrThrow(id, "Extras");
        updateFieldsExtras(ExtrasExisting, extra);
        ExtrasModel saveExtras = extrasRepository.save(ExtrasExisting);
        return mapper.toDTO(saveExtras);
    }

    // --------------- Status Components ----------------------
    public MenuModel StatusMenu(int id, int active){
        MenuModel menu = findMenuOrThrow(id,"Menu");
        menu.setIs_active(active);
        return menuRepository.save(menu);
    }
//    public BuildsModel StatusBuild(int id, int active){
//        BuildsModel build = findBuildOrThrow(id,"Build");
//        build.setIs_active(active);
//        return menuRepository.save(build);
//    }
    public IngredientsModel StatusIngredient(int id, int active){
        IngredientsModel ingredient = findIngredientsOrThrow(id,"Ingredient");
        ingredient.setIs_active(active);
        return ingredientsRepository.save(ingredient);
    }

    public ExtrasModel StatusExtras(int id, int active){
        ExtrasModel extras = findExtrasOrThrow(id,"Extra");
        extras.setIs_active(active);
        return extrasRepository.save(extras);
    }

    // -------------------- Delete Components -------------------
    public MenuModel deleteMenu(int id){
        MenuModel menu = findMenuOrThrow(id, "menu");
        menuRepository.deleteById(id);
        return menu;
    }
    public BuildsModel deleteBuild(int id){
        BuildsModel build = findBuildOrThrow(id, "Build");
        buildsRepository.deleteById(id);
        return build;
    }
    public ExtrasModel deleteExtras(int id){
        ExtrasModel extras = findExtrasOrThrow(id,"Extras");
        extrasRepository.deleteById(id);
        return extras;
    }
    public IngredientsModel deleteIngredient(int id) {
        IngredientsModel ingredient = findIngredientsOrThrow(id, "ingrediente");
        ingredientsRepository.deleteById(id);
        return ingredient;
    }



    // -------------------- Private helper --------------------
    private MenuDTO mapFullMenu(MenuModel menu) {
        List<IngredientsDTO> ingredients = ingredientsRepository.findByMenuId(menu.getId())
                .stream()
                .map(mapper::toDTO)
                .toList();

        List<ExtrasDTO> extras = extrasRepository.findByMenuId(menu.getId())
                .stream()
                .map(mapper::toDTO)
                .toList();

        List<BuildsDTO> builds = buildsRepository.findByMenuId(menu.getId())
                .stream()
                .map(mapper::toDTO)
                .toList();

        return mapper.toDTO(menu, ingredients, extras, builds);
    }

    // ----------------------- Update Fields ------------------------------
    private void updateFieldsMenu(MenuModel existing, MenuDTO update){
        if(update.getName() != null)
            existing.setName(update.getName());
        if(update.getCategory_id() != null)
            existing.setCategory_id(update.getCategory_id());
        if(update.getPrice() != null)
            existing.setPrice(update.getPrice());
        if(update.getPrice_ch() != null)
            existing.setPrice_ch(update.getPrice_ch());
        if(update.getPrice_med() != null)
            existing.setPrice_med(update.getPrice_med());
        if(update.getPrice_ch() != null)
            existing.setPrice_gde(update.getPrice_gde());
        if(update.getDescription() != null)
            existing.setDescription(update.getDescription());

        if(update.getIs_active() != null) {
            existing.setIs_active(update.getIs_active());
            System.out.println("hola buenas " + update.getIs_active());
        }
    }
    private void updateFieldsBuidls(BuildsModel existing, BuildsDTO update){
        if(update.getName() != null)
            existing.setName(update.getName());

        // Actualiza el menú si se manda un nuevo menu_id
        if (update.getMenu_id() != null) {
            MenuModel menu = menuRepository.findById(update.getMenu_id())
                    .orElseThrow(() -> new RuntimeException("Menu no encontrado"));
            existing.setMenu(menu);
        }

        // Actualiza los ingredientes si se mandan nuevos IDs
        if (update.getIngredientIds() != null && !update.getIngredientIds().isEmpty()) {
            List<IngredientsModel> ingredients = ingredientsRepository.findAllById(update.getIngredientIds());
            existing.setIngredients(ingredients);
        }
        if(update.getQuantity_gr() != null)
            existing.setQuantity_gr(update.getQuantity_gr());
        if(update.getQuantity_md() != null)
            existing.setQuantity_md(update.getQuantity_md());

    }

    private void updateFieldIngrdients(IngredientsModel existing, IngredientsDTO update){
        if (update.getName() != null)
            existing.setName(update.getName());
        if (update.getMenu_id() != null) {
            MenuModel menu = menuRepository.findById(update.getMenu_id())
                    .orElseThrow(() -> new RuntimeException("Menu no encontrado"));
            existing.setMenu(menu);
        }
        if (update.getCategory_id() != null)
            existing.setCategory_id(update.getCategory_id());
        if(update.getIs_active() != null)
            existing.setIs_active(update.getIs_active());
    }

    private void updateFieldsExtras(ExtrasModel existing, ExtrasDTO update){
        if (update.getName() != null)
            existing.setName(update.getName());
        if (update.getPrice() != null)
            existing.setPrice(update.getPrice());
        if (update.getMenu_id() != null) {
            MenuModel menu = menuRepository.findById(update.getMenu_id())
                    .orElseThrow(() -> new RuntimeException("Menu no encontrado"));
            existing.setMenu(menu);
        }
        if(update.getIs_active() != null)
            existing.setIs_active(update.getIs_active());
    }



    // ----------------- Find Exception ---------------------------
    private MenuModel findMenuOrThrow(int id,String component){
        return menuRepository.findById(id)
                    .orElseThrow(() -> new ComponentFoundException(id, component));
    }

    private  BuildsModel findBuildOrThrow(int id, String component){
        return buildsRepository.findById(id)
                .orElseThrow(() -> new ComponentFoundException(id,component));
    }
    private ExtrasModel findExtrasOrThrow(int id, String component){
        return  extrasRepository.findById(id)
                .orElseThrow(() -> new ComponentFoundException(id,component));
    }
    private IngredientsModel findIngredientsOrThrow(int id, String component){
        return ingredientsRepository.findById(id)
                .orElseThrow(() -> new ComponentFoundException(id, component));
    }



    @ResponseStatus(HttpStatus.NOT_FOUND)
    public class ComponentFoundException extends RuntimeException{
        public ComponentFoundException(long id, String component){
            super ("No se escontro el "+component);
        }
    }
}

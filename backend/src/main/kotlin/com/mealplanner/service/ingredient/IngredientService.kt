package com.mealplanner.service.ingredient

import com.mealplanner.data.ingredient.Ingredient
import com.mealplanner.repositories.ingredient.IngredientRepository
import com.mealplanner.service.shopping.ShoppingItemService
import org.springframework.stereotype.Service

@Service
class IngredientService(
    private val ingredientRepository: IngredientRepository,
    private val foodIngredientService: FoodIngredientService,
    private val homeIngredientService: HomeIngredientService,
    private val shoppingItemService: ShoppingItemService
) {
    fun getAllIngredients(): List<Ingredient> {
        return ingredientRepository.findAll()
    }

    fun getIngredientById(id: Long): Ingredient? {
        return ingredientRepository.findById(id).orElse(null)
    }

    fun createIngredient(ingredient: Ingredient): Ingredient {
        return ingredientRepository.save(ingredient)
    }

    fun updateIngredient(id: Long, ingredient: Ingredient): Ingredient? {
        return if (ingredientRepository.existsById(id)) {
            ingredientRepository.save(ingredient)
        } else {
            null
        }
    }

    fun deleteIngredient(id: Long) {
        val ingredient = ingredientRepository.findById(id).orElseThrow {
            throw RuntimeException("Ingredient not found")
        }

        foodIngredientService.deleteByIngredientId(id)
        homeIngredientService.deleteByIngredientId(id)
        shoppingItemService.deleteByIngredientId(id)
        ingredientRepository.delete(ingredient)
    }
}
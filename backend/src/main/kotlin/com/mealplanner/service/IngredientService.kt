package com.mealplanner.service

import com.mealplanner.data.Ingredient
import com.mealplanner.repositories.IngredientRepository
import org.springframework.stereotype.Service

@Service
class IngredientService(
    private val ingredientRepository: IngredientRepository
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

        ingredientRepository.delete(ingredient)
    }
}
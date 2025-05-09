package com.mealplanner.service.ingredient

import com.mealplanner.data.ingredient.HomeIngredient
import com.mealplanner.repositories.ingredient.HomeIngredientRepository
import com.mealplanner.repositories.ingredient.IngredientRepository
import org.springframework.stereotype.Service
import kotlin.RuntimeException

@Service
class HomeIngredientService(
    private val homeIngredientRepository: HomeIngredientRepository,
    private val ingredientRepository: IngredientRepository
) {
    fun getAllHomeIngredients(): List<HomeIngredient> {
        return homeIngredientRepository.findAll()
    }

    fun getHomeIngredientById(id: Long): HomeIngredient? {
        return homeIngredientRepository.findById(id).orElse(null)
    }

    fun getByIngredientId(ingredientId: Long): HomeIngredient? {
        return homeIngredientRepository.findAll().find { it.ingredient?.id == ingredientId }
    }

    fun createHomeIngredient(ingredientId: Long, quantity: String): HomeIngredient {
        val ingredient = ingredientRepository.findById(ingredientId).orElseThrow { RuntimeException("Ingredient not found")}

        if (homeIngredientRepository.findAll().any { it.ingredient?.id == ingredientId }) {
            throw RuntimeException("Home ingredient for this ingredient already exists")
        }

        val homeIngredient = HomeIngredient(
            id = null,
            ingredient = ingredient,
            quantity = quantity
        )
        return homeIngredientRepository.save(homeIngredient)
    }

    fun updateHomeIngredient(id: Long, quantity: String): HomeIngredient {
        val existing = homeIngredientRepository.findById(id).orElseThrow { RuntimeException("Home ingredient not found") }
        val updated = existing.copy(quantity = quantity)
        return homeIngredientRepository.save(updated)
    }

    fun deleteHomeIngredient(id: Long) {
        val homeIngredient = homeIngredientRepository.findById(id).orElseThrow { RuntimeException("Home ingredient not found") }
        homeIngredientRepository.delete(homeIngredient)
    }
}
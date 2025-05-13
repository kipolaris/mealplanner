package com.mealplanner.service.ingredient

import com.mealplanner.data.ingredient.FoodIngredient
import com.mealplanner.repositories.FoodRepository
import com.mealplanner.repositories.ingredient.FoodIngredientRepository
import com.mealplanner.repositories.ingredient.IngredientRepository
import com.mealplanner.repositories.ingredient.UnitOfMeasureRepository
import org.springframework.stereotype.Service

@Service
class FoodIngredientService(
    private val foodIngredientRepository: FoodIngredientRepository,
    private val ingredientRepository: IngredientRepository,
    private val foodRepository: FoodRepository,
    private val unitOfMeasureRepository: UnitOfMeasureRepository
) {
    fun createFoodIngredient(foodId: Long, ingredientId: Long, amount: Double, unitId: Long): FoodIngredient {
        val food = foodRepository.findById(foodId).orElseThrow { RuntimeException("Food not found") }
        val ingredient = ingredientRepository.findById(ingredientId).orElseThrow { RuntimeException("Ingredient not found") }
        val unit = unitOfMeasureRepository.findById(unitId).orElseThrow { RuntimeException("Unit of measure not found") }

        val foodIngredient = FoodIngredient(
            id = null,
            food = food,
            ingredient = ingredient,
            amount = amount,
            unit = unit
        )
        return foodIngredientRepository.save(foodIngredient)
    }


    fun updateFoodIngredient(id: Long, amount: Double, unitId: Long): FoodIngredient {
        val existing = foodIngredientRepository.findById(id)
            .orElseThrow { RuntimeException("Food ingredient not found") }
        val unit = unitOfMeasureRepository.findById(unitId).orElseThrow { RuntimeException("Unit of measure not found") }

        val updated = existing.copy(amount = amount, unit = unit)
        return foodIngredientRepository.save(updated)
    }

    fun deleteFoodIngredient(id: Long) {
        val foodIngredient = foodIngredientRepository.findById(id)
            .orElseThrow { RuntimeException("FoodIngredient not found") }

        foodIngredientRepository.delete(foodIngredient)
    }
}
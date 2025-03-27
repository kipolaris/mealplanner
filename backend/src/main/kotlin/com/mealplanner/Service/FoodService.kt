package com.mealplanner.Service

import com.mealplanner.Data.Food
import com.mealplanner.Data.Ingredient
import com.mealplanner.Repositories.FoodRepository
import com.mealplanner.Repositories.IngredientRepository
import org.springframework.stereotype.Service

@Service
class FoodService(private val foodRepository: FoodRepository, private val ingredientRepository: IngredientRepository) {

    fun getAllFoods(): List<Food> {
        return foodRepository.findAll()
    }

    fun getFoodById(id: Long): Food? {
        return foodRepository.findById(id).orElse(null)
    }

    fun createFood(food: Food): Food {
        return foodRepository.save(food)
    }

    fun updateFood(id: Long, food: Food): Food? {
        return if (foodRepository.existsById(id)) {
            foodRepository.save(food)
        } else {
            null
        }
    }

    fun deleteFood(id: Long): Boolean {
        return if (foodRepository.existsById(id)) {
            foodRepository.deleteById(id)
            true
        } else {
            false
        }
    }

    fun addIngredientToFood(foodId: Long, ingredient: Ingredient): Food? {
        val food = foodRepository.findById(foodId).orElse(null) ?: return null
        ingredientRepository.save(ingredient)
        food.ingredients?.add(ingredient)
        return foodRepository.save(food)
    }
}

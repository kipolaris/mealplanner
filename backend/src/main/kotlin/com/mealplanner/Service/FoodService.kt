package com.mealplanner.Service

import com.mealplanner.Data.Food
import com.mealplanner.Data.Ingredient
import com.mealplanner.Repositories.FoodRepository
import com.mealplanner.Repositories.IngredientRepository
import com.mealplanner.Repositories.MealRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class FoodService(
    private val foodRepository: FoodRepository,
    private val ingredientRepository: IngredientRepository,
    private val mealRepository: MealRepository
) {

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

    @Transactional
    fun deleteFood(foodId: Long) {
        val food = foodRepository.findById(foodId).orElseThrow {
            throw RuntimeException("Food not found")
        }

        val meals = mealRepository.findByFood(food)

        meals.forEach { meal ->
            meal.food = null
            mealRepository.save(meal)
        }

        foodRepository.delete(food)
    }


    fun addIngredientToFood(foodId: Long, ingredient: Ingredient): Food? {
        val food = foodRepository.findById(foodId).orElse(null) ?: return null
        ingredientRepository.save(ingredient)
        food.ingredients?.add(ingredient)
        return foodRepository.save(food)
    }
}

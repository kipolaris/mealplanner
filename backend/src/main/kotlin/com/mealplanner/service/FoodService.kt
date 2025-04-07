package com.mealplanner.service

import com.mealplanner.data.Food
import com.mealplanner.data.Ingredient
import com.mealplanner.repositories.FoodRepository
import com.mealplanner.repositories.IngredientRepository
import com.mealplanner.repositories.MealRepository
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

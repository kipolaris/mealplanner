package com.mealplanner.service

import com.mealplanner.data.Food
import com.mealplanner.data.ingredient.Ingredient
import com.mealplanner.repositories.FoodRepository
import com.mealplanner.repositories.ingredient.IngredientRepository
import com.mealplanner.repositories.MealRepository
import com.mealplanner.repositories.ingredient.FoodIngredientRepository
import com.mealplanner.service.ingredient.FoodIngredientService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class FoodService(
    private val foodRepository: FoodRepository,
    private val mealRepository: MealRepository,
    private val foodIngredientService: FoodIngredientService
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


    @Transactional
    fun addIngredientToFood(foodId: Long, ingredientId: Long, quantity: String): Food {
        val food = foodRepository.findById(foodId).orElseThrow { RuntimeException("Food not found") }
        val foodIngredient = foodIngredientService.createFoodIngredient(foodId, ingredientId, quantity)
        food.ingredients.add(foodIngredient)
        return foodRepository.save(food)
    }

    fun deleteIngredientFromFood(foodId: Long, foodIngredientId: Long): Food {
        val food = foodRepository.findById(foodId).orElseThrow { RuntimeException("Food not found") }
        val foodIngredient = food.ingredients.find { it.id == foodIngredientId }
            ?: throw RuntimeException("FoodIngredient not found in Food")

        food.ingredients.remove(foodIngredient)
        foodIngredientService.deleteFoodIngredient(foodIngredientId)

        return foodRepository.save(food)
    }

    fun updateIngredientInFood(foodId: Long, foodIngredientId: Long, newQuantity: String): Food {
        val food = foodRepository.findById(foodId).orElseThrow { RuntimeException("Food not found") }
        val updated = foodIngredientService.updateFoodIngredient(foodIngredientId, newQuantity)

        food.ingredients = food.ingredients
            .map { if (it.id == updated.id) updated else it }
            .toMutableList()

        return foodRepository.save(food)
    }
}

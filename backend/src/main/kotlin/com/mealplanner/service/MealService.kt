package com.mealplanner.service

import com.mealplanner.data.Food
import com.mealplanner.data.Meal
import com.mealplanner.repositories.MealRepository
import org.springframework.stereotype.Service

@Service
class MealService(
    private val mealRepository: MealRepository
) {

    fun getAllMeals(): List<Meal> {
        return mealRepository.findAll()
    }

    fun getMealById(id: Long): Meal? {
        return mealRepository.findById(id).orElse(null)
    }

    fun createMeal(meal: Meal): Meal {
        return mealRepository.save(meal)
    }

    fun updateMeal(id: Long, meal: Meal): Meal? {
        return if (mealRepository.existsById(id)) {
            mealRepository.save(meal)
        } else {
            null
        }
    }

    fun deleteMeal(id: Long): Boolean {
        return if (mealRepository.existsById(id)) {
            mealRepository.deleteById(id)
            true
        } else {
            false
        }
    }

    fun addFoodToMeal(mealId: Long, food: Food): Meal? {
        val meal = mealRepository.findById(mealId).orElse(null) ?: return null
        meal.food = food
        return mealRepository.save(meal)
    }

    fun removeFoodFromMeal(mealId: Long, foodId: Long): Meal? {
        val meal = mealRepository.findById(mealId).orElse(null) ?: return null
        if (meal.food?.id == foodId) meal.food = null
        return mealRepository.save(meal)
    }
}

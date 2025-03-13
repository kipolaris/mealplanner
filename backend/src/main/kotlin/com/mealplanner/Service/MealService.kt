package com.mealplanner.Service

import com.mealplanner.Data.Food
import com.mealplanner.Data.Meal
import com.mealplanner.Repositories.FoodRepository
import com.mealplanner.Repositories.MealRepository
import com.mealplanner.Repositories.DayRepository
import org.springframework.stereotype.Service

@Service
class MealService(
    private val mealRepository: MealRepository,
    private val foodRepository: FoodRepository,
    private val dayRepository: DayRepository
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
        meal.foods += food
        return mealRepository.save(meal)
    }

    fun removeFoodFromMeal(mealId: Long, foodId: Long): Meal? {
        val meal = mealRepository.findById(mealId).orElse(null) ?: return null
        meal.foods.removeIf { it.id == foodId }
        return mealRepository.save(meal)
    }
}

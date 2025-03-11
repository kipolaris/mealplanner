package com.mealplanner.Service

import com.mealplanner.Data.Food
import com.mealplanner.Data.Meal
import com.mealplanner.Data.MealDay
import com.mealplanner.Repositories.FoodRepository
import com.mealplanner.Repositories.MealRepository
import com.mealplanner.Repositories.MealDayRepository
import org.springframework.stereotype.Service

@Service
class MealService(
    private val mealRepository: MealRepository,
    private val foodRepository: FoodRepository,
    private val mealDayRepository: MealDayRepository
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

    fun addFoodToMeal(mealId: Long, dayId: Long, food: Food): Meal? {
        val meal = mealRepository.findById(mealId).orElse(null) ?: return null
        val mealDay = mealDayRepository.findById(dayId).orElse(null) ?: return null
        val existingFood = foodRepository.findByName(food.name) ?: foodRepository.save(food)
        meal.foods[mealDay] = existingFood
        return mealRepository.save(meal)
    }

    fun removeFoodFromMeal(mealId: Long, dayId: Long, foodId: Long): Meal? {
        val meal = mealRepository.findById(mealId).orElse(null) ?: return null
        val mealDay = mealDayRepository.findById(dayId).orElse(null) ?: return null
        meal.foods.entries.removeIf { it.key == mealDay && it.value.id == foodId }
        return mealRepository.save(meal)
    }
}

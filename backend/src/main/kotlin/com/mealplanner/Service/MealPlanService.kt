package com.mealplanner.Service

import com.mealplanner.Data.MealDay
import com.mealplanner.Data.Meal
import com.mealplanner.Data.MealPlan
import com.mealplanner.Data.Food
import com.mealplanner.Repositories.MealDayRepository
import com.mealplanner.Repositories.MealPlanRepository
import com.mealplanner.Repositories.MealRepository
import org.springframework.stereotype.Service

@Service
class MealPlanService(
    private val mealPlanRepository: MealPlanRepository,
    private val mealDayRepository: MealDayRepository,
    private val mealRepository: MealRepository
) {
    private val mealPlanId = 1L // Singleton ID

    fun getMealPlan(): MealPlan {
        return mealPlanRepository.findById(mealPlanId).orElseGet {
            val mealPlan = MealPlan(id = mealPlanId, mealDays = initializeDays())
            mealPlanRepository.save(mealPlan)
        }
    }

    private fun initializeDays(): MutableList<MealDay> {
        val daysOfWeek = listOf("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")

        return daysOfWeek.map { dayName ->
            MealDay(
                name = dayName,
                meals = mutableListOf(
                    mealRepository.save(Meal(name = "Breakfast")),
                    mealRepository.save(Meal(name = "Lunch")),
                    mealRepository.save(Meal(name = "Dinner"))
                )
            )
        }.toMutableList().also { mealDayRepository.saveAll(it) }
    }

    fun resetMealPlan(): MealPlan {
        val mealPlan = getMealPlan()
        mealPlan.mealDays.forEach { day ->
            day.meals.forEach { it.foods.clear() }
        }
        mealDayRepository.saveAll(mealPlan.mealDays)
        return mealPlanRepository.save(mealPlan)
    }

    fun resetMealDay(dayId: Long): MealDay? {
        val day = mealDayRepository.findById(dayId).orElse(null) ?: return null
        day.meals.forEach { it.foods.clear() }
        return mealDayRepository.save(day)
    }

    fun updateMealInDay(dayId: Long, mealType: String, meal: Meal): MealDay? {
        val day = mealDayRepository.findById(dayId).orElse(null) ?: return null
        val savedMeal = mealRepository.save(meal)

        val existingMeal = day.meals.find { it.name.equals(mealType, ignoreCase = true) }
        if (existingMeal != null) {
            existingMeal.foods.putAll(savedMeal.foods)
        } else {
            day.meals.add(savedMeal)
        }

        return mealDayRepository.save(day)
    }

    fun removeFoodFromMeal(dayId: Long, mealType: String, foodId: Long): MealDay? {
        val day = mealDayRepository.findById(dayId).orElse(null) ?: return null
        val meal = day.meals.find { it.name.equals(mealType, ignoreCase = true) } ?: return null

        meal.foods.entries.removeIf { it.value.id == foodId }
        mealRepository.save(meal)
        return mealDayRepository.save(day)
    }
}

package com.mealplanner.Service

import com.mealplanner.Data.MealDay
import com.mealplanner.Data.Meal
import com.mealplanner.Data.MealPlan
import com.mealplanner.Repositories.MealDayRepository
import com.mealplanner.Repositories.MealPlanRepository
import com.mealplanner.Repositories.MealRepository
import org.springframework.stereotype.Service
import java.util.*

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
        val daysOfWeek = listOf(
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        )
        return daysOfWeek.map { MealDay(name = it) }.toMutableList().also { mealDayRepository.saveAll(it) }
    }

    fun resetMealPlan(): MealPlan {
        val mealPlan = getMealPlan()
        mealPlan.mealDays.forEach { day ->
            day.breakfast = null
            day.lunch = null
            day.dinner = null
        }
        mealDayRepository.saveAll(mealPlan.mealDays)
        return mealPlanRepository.save(mealPlan)
    }

    fun updateMealInDay(dayId: Long, mealType: String, meal: Meal): MealDay? {
        val day = mealDayRepository.findById(dayId).orElse(null) ?: return null
        val savedMeal = mealRepository.save(meal)
        when (mealType.lowercase(Locale.getDefault())) {
            "breakfast" -> day.breakfast = savedMeal
            "lunch" -> day.lunch = savedMeal
            "dinner" -> day.dinner = savedMeal
            else -> return null
        }
        return mealDayRepository.save(day)
    }

    fun removeFoodFromMeal(dayId: Long, mealType: String, foodId: Long): MealDay? {
        val day = mealDayRepository.findById(dayId).orElse(null) ?: return null
        val meal = when (mealType.toLowerCase()) {
            "breakfast" -> day.breakfast
            "lunch" -> day.lunch
            "dinner" -> day.dinner
            else -> return null
        } ?: return null

        meal.foods.removeIf { it.id == foodId }
        mealRepository.save(meal)
        return mealDayRepository.save(day)
    }
}


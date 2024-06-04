package com.mealplanner.Service

import com.mealplanner.Data.Day
import com.mealplanner.Data.MealPlan
import com.mealplanner.Repositories.DayRepository
import com.mealplanner.Repositories.MealPlanRepository
import org.springframework.stereotype.Service

@Service
class MealPlanService(private val mealPlanRepository: MealPlanRepository, private val dayRepository: DayRepository) {

    private val mealPlanId = 1L // Assuming the singleton meal plan always has ID 1

    fun getMealPlan(): MealPlan {
        return mealPlanRepository.findById(mealPlanId).orElseGet {
            val mealPlan = MealPlan(id = mealPlanId)
            mealPlanRepository.save(mealPlan)
        }
    }

    fun resetMealPlan(): MealPlan {
        val mealPlan = getMealPlan()
        mealPlan.days.clear()
        return mealPlanRepository.save(mealPlan)
    }

    fun addDayToMealPlan(day: Day): MealPlan {
        val mealPlan = getMealPlan()
        mealPlan.days.add(dayRepository.save(day))
        return mealPlanRepository.save(mealPlan)
    }

    fun removeFoodFromMeal(mealId: Long, foodId: Long): MealPlan {
        val mealPlan = getMealPlan()
        mealPlan.days.forEach { day ->
            day.breakfast?.let { meal -> if (meal.id == mealId) meal.foods.removeIf { it.id == foodId } }
            day.lunch?.let { meal -> if (meal.id == mealId) meal.foods.removeIf { it.id == foodId } }
            day.dinner?.let { meal -> if (meal.id == mealId) meal.foods.removeIf { it.id == foodId } }
        }
        return mealPlanRepository.save(mealPlan)
    }
}

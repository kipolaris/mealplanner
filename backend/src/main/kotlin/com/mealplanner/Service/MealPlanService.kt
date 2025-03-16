package com.mealplanner.Service

import com.mealplanner.Data.Day
import com.mealplanner.Data.MealTime
import com.mealplanner.Data.Meal
import com.mealplanner.Data.MealPlan
import com.mealplanner.Repositories.DayRepository
import com.mealplanner.Repositories.MealPlanRepository
import com.mealplanner.Repositories.MealRepository
import com.mealplanner.Repositories.MealTimeRepository
import org.springframework.stereotype.Service

@Service
class MealPlanService(
    private val mealPlanRepository: MealPlanRepository,
    private val dayRepository: DayRepository,
    private val mealRepository: MealRepository,
    private val mealTimeRepository: MealTimeRepository
) {
    private val mealPlanId = 1L // Singleton ID

    fun getMealPlan(): MealPlan {
        return mealPlanRepository.findById(mealPlanId).orElseGet {
            val mealPlan = MealPlan(id = mealPlanId, days = initializeDays(), mealTimes = initializeMealTimes())
            mealPlanRepository.save(mealPlan)
        }
    }

    private fun initializeMealTimes(): MutableList<MealTime> {
        val basicMealTimes = listOf("Breakfast", "Lunch", "Dinner")
        return basicMealTimes.map {
            MealTime(name = it)
        }.toMutableList()
    }
    private fun initializeDays(): MutableList<Day> {
        val daysOfWeek = listOf("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")

        return daysOfWeek.map { dayName ->
            Day(
                name = dayName,
                id = 0
            )
        }.let { dayRepository.saveAll(it) }
    }

    fun resetMealPlan(mealTimesRequest: Map<String, List<Map<String, String>>>): MealPlan {
        val mealPlan = getMealPlan()

        mealPlan.days.forEach { day ->
            day.meals.forEach { meal ->
                meal.foods.clear()
            }
        }

        val mealTimes = mealTimesRequest["mealTimes"]?.map { it["name"] ?: "" }?.filter { it.isNotBlank() } ?: emptyList()
        mealPlan.mealTimes = mealTimes.map { MealTime(name = it) }.toMutableList()

        mealPlanRepository.save(mealPlan)
        return mealPlan
    }


    fun updateMealInDay(dayId: Long, mealType: String, meal: Meal): Day? {
        val day = dayRepository.findById(dayId).orElse(null) ?: return null
        val savedMeal = mealRepository.save(meal)

       val existingMeal = day.meals.find { it.mealTime.name.equals(mealType, ignoreCase = true) }
       if (existingMeal != null) {
            existingMeal.foods += savedMeal.foods
        } else {
            day.meals += savedMeal
        }

        return dayRepository.save(day)
    }

    fun removeFoodFromMeal(dayId: Long, mealId: Long, foodId: Long): Day? {
        val day = dayRepository.findById(dayId).orElse(null) ?: return null
        val meal = day.meals.find { it.id == mealId }?: return null

        meal.foods.removeIf { it.id == foodId }

        mealRepository.save(meal)
        return dayRepository.save(day)
    }
}

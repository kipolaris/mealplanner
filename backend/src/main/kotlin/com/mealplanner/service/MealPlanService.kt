package com.mealplanner.service

import com.mealplanner.data.Day
import com.mealplanner.data.Meal
import com.mealplanner.data.MealPlan
import com.mealplanner.data.MealTime
import com.mealplanner.repositories.*
import org.springframework.stereotype.Service

@Service
class MealPlanService(
    private val mealPlanRepository: MealPlanRepository,
    private val dayRepository: DayRepository,
    private val mealTimeRepository: MealTimeRepository,
    private val foodRepository: FoodRepository
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
        return basicMealTimes.mapIndexed {index, mt ->
            MealTime(name = mt, order = index)
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
                meal.food = null
            }
        }


        val mealTimes = mealTimesRequest["mealTimes"]?.map {
            if(!mealTimeRepository.existsById(it["id"]?.toLong()!!)) {
                mealTimeRepository.save(MealTime(id = it["id"]!!.toLong(), name = it["name"]!!))
            }
            mealTimeRepository.getReferenceById(it["id"]!!.toLong())
        } ?: listOf()
        mealPlan.mealTimes = mealTimes.toMutableList()

        mealPlanRepository.save(mealPlan)
        return mealPlan
    }

    fun resetMealTime(mealTime: MealTime) : MealPlan {
        val mealPlan = getMealPlan()

        mealPlan.days.forEach { day ->
            day.meals.forEach { meal ->
                if(meal.mealTime==mealTime) meal.food = null
            }
        }

        mealPlanRepository.save(mealPlan)
        return mealPlan
    }

    fun resetDay(day: Day): MealPlan {
        val mealPlan = getMealPlan()

        val existingDay = mealPlan.days.find { it.id == day.id }
            ?: throw IllegalArgumentException("Day with id ${day.id} not found in the meal plan")

        existingDay.meals.forEach { it.food = null }

        return mealPlanRepository.save(mealPlan)
    }


    fun updateMealPlan(updatedMealPlan: MealPlan): MealPlan {
        val mealPlan = getMealPlan()

        updateMealTimes(mealPlan, updatedMealPlan.mealTimes)

        updatedMealPlan.days.forEach { updatedDay ->
            updateMealsForDay(mealPlan, updatedDay)
        }

        println("Meal plan after update: $mealPlan")
        return mealPlanRepository.save(mealPlan)
    }

    private fun updateMealTimes(mealPlan: MealPlan, newMealTimes: MutableList<MealTime>) {
        newMealTimes.forEach {mt ->
            if(mt.id?.let { mealTimeRepository.existsById(it) } == false) mealTimeRepository.save(mt)
        }

        mealPlan.mealTimes.clear()
        mealPlan.mealTimes = newMealTimes
    }

    private fun updateMealsForDay(mealPlan: MealPlan, updatedDay: Day) {
        val existingDay = mealPlan.days.find { it.id == updatedDay.id }
        if (existingDay != null) {
            updatedDay.meals.forEach { meal ->
                updateMeal(existingDay, meal)
            }
        }
    }

    private fun updateMeal(day: Day, meal: Meal) {
        val managedFood = meal.food?.id?.let {
            foodRepository.findById(it).orElse(null)
        } ?: meal.food

        if (managedFood?.id != null) {
            meal.food = managedFood
        } else {
            println(managedFood)
        }

        val existingMeal = day.meals.find { it.mealTime.id == meal.mealTime.id }

        if (existingMeal != null) {
            existingMeal.food = managedFood
        } else {
            val newMeal = Meal(
                mealTime = meal.mealTime,
                food = managedFood,
                dayId = day.id
            )

            day.meals.add(newMeal)
        }
    }
}

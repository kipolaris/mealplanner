package com.mealplanner.Service

import com.mealplanner.Data.Day
import com.mealplanner.Data.MealTime
import com.mealplanner.Data.Meal
import com.mealplanner.Data.MealPlan
import com.mealplanner.Repositories.*
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
class MealPlanService(
    private val mealPlanRepository: MealPlanRepository,
    private val dayRepository: DayRepository,
    private val mealRepository: MealRepository,
    private val mealTimeRepository: MealTimeRepository,
    private val foodRepository: FoodRepository
) {
    private val mealPlanId = 1L // Singleton ID

    @PersistenceContext
    private lateinit var entityManager: EntityManager

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
                meal.food = null
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

        val mealTime = mealTimeRepository.findByName(mealType) ?: mealTimeRepository.save(MealTime(name = mealType))

        val existingMeal = day.meals.find { it.mealTime.name.equals(mealType, ignoreCase = true) }
        if (existingMeal != null) {
            existingMeal.food = savedMeal.food
        } else {
            day.meals += savedMeal.copy(mealTime = mealTime)
        }

        return dayRepository.save(day)
    }

    fun removeFoodFromMeal(dayId: Long, mealId: Long, foodId: Long): Day? {
        val day = dayRepository.findById(dayId).orElse(null) ?: return null
        val meal = day.meals.find { it.id == mealId }?: return null

        if (meal.food?.id == foodId) meal.food = null

        mealRepository.save(meal)
        return dayRepository.save(day)
    }

    fun updateMealPlan(updatedMealPlan: MealPlan): MealPlan {
        val existingMealPlan = getMealPlan()
        val mealTimeMap = existingMealPlan.mealTimes.associateBy { it.name }.toMutableMap()

        updatedMealPlan.days.forEach { updatedDay ->
            val existingDay = existingMealPlan.days.find { it.id == updatedDay.id }
            if (existingDay != null) {
                updatedDay.meals.forEach { meal ->
                    println(meal)

                    // Ensure Food is managed
                    val managedFood = meal.food?.id?.let {
                        foodRepository.findById(it).orElse(null)
                    } ?: meal.food

                    if (managedFood?.id != null) {
                        // Use only the managed version of the Food entity
                        meal.food = managedFood
                    }

                    val existingMeal = existingDay.meals.find { it.mealTime.id == meal.mealTime.id }

                    if (existingMeal != null) {
                        existingMeal.food = managedFood
                    } else {
                        val mealTime = mealTimeMap.getOrPut(meal.mealTime.name) {
                            mealTimeRepository.save(MealTime(name = meal.mealTime.name))
                        }
                        val newMeal = Meal(
                            mealTime = mealTime,
                            food = managedFood,
                            dayId = updatedDay.id
                        )
                        existingDay.meals.add(newMeal)
                    }
                }
            }
        }

        return mealPlanRepository.save(existingMealPlan)
    }
}

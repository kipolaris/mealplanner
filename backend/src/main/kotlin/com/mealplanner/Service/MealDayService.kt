package com.mealplanner.Service

import com.mealplanner.Data.MealDay
import com.mealplanner.Repositories.MealDayRepository
import org.springframework.stereotype.Service

@Service
class MealDayService(private val mealDayRepository: MealDayRepository) {

    fun getAllMealDays(): List<MealDay> {
        return mealDayRepository.findAll()
    }

    fun getMealDayById(id: Long): MealDay? {
        return mealDayRepository.findById(id).orElse(null)
    }

    fun createMealDay(mealDay: MealDay): MealDay {
        return mealDayRepository.save(mealDay)
    }

    fun updateMealDay(id: Long, updatedMealDay: MealDay): MealDay? {
        return if (mealDayRepository.existsById(id)) {
            mealDayRepository.save(updatedMealDay.copy(id = id))
        } else {
            null
        }
    }
}

package com.mealplanner.service

import com.mealplanner.data.MealTime
import com.mealplanner.repositories.MealTimeRepository
import org.springframework.stereotype.Service

@Service
class MealTimeService(private val mealTimeRepository: MealTimeRepository) {
    fun getAllMealTimes(): List<MealTime> {
        return mealTimeRepository.findAll()
    }

    fun getMealTimeById(id: Long): MealTime? {
        return mealTimeRepository.findById(id).orElse(null)
    }

    fun createMealTime(mealTime: MealTime): MealTime {
        return mealTimeRepository.save(mealTime)
    }

    fun updateMealTime(id: Long, updateMealTime: MealTime): MealTime? {
        return if (mealTimeRepository.existsById(id)) {
            mealTimeRepository.save(updateMealTime.copy(id = id))
        } else {
            null
        }
    }
    fun deleteMealTime(id: Long): Boolean {
        return if (mealTimeRepository.existsById(id)) {
            mealTimeRepository.deleteById(id)
            true
        } else {
            false
        }
    }

    fun reorderMealTimes(mealTimeId1: Long, mealTimeId2: Long) {
        val mealTime1 = mealTimeRepository.findById(mealTimeId1).orElseThrow()
        val mealTime2 = mealTimeRepository.findById(mealTimeId2).orElseThrow()

        val tempOrder = mealTime1.order
        mealTime1.order = mealTime2.order
        mealTime2.order = tempOrder

        mealTimeRepository.save(mealTime1)
        mealTimeRepository.save(mealTime2)
    }

    fun getNextOrderValue(): Int {
        return (mealTimeRepository.findMaxOrder() ?: 0) + 1
    }
}

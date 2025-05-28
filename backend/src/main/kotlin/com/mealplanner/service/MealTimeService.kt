package com.mealplanner.service

import com.mealplanner.data.MealTime
import com.mealplanner.repositories.MealRepository
import com.mealplanner.repositories.MealTimeRepository
import org.springframework.stereotype.Service

@Service
class MealTimeService(
    private val mealTimeRepository: MealTimeRepository,
    private val mealRepository: MealRepository
) {
    fun getAllMealTimes(): List<MealTime> {
        return mealTimeRepository.findAll()
    }

    fun getMealTimeById(id: Long): MealTime? {
        return mealTimeRepository.findById(id).orElse(null)
    }

    fun createMealTime(mealTime: MealTime): MealTime {
        return mealTimeRepository.save(mealTime)
    }

    fun updateMealTime(updatedMealTime: MealTime): MealTime? {
        val id = updatedMealTime.id ?: return null
        return mealTimeRepository.findById(id).map { existing ->
            existing.copy(name = updatedMealTime.name)
        }.map(mealTimeRepository::save).orElse(null)
    }

    fun deleteMealTime(id: Long): Boolean {
        val mealTime = mealTimeRepository.findById(id).orElse(null)

        return if (mealTime != null) {
            mealRepository.findAll().forEach { meal ->
                if (meal.mealTime.id == id) {
                    meal.food = null
                    mealRepository.delete(meal)
                }
            }
            mealTimeRepository.delete(mealTime)

            val allRemaining = mealTimeRepository.findAll().sortedBy { it.order }
            allRemaining.forEachIndexed { index, mt ->
                println(mt)
                mt.order = index
                println(mt)
                mealTimeRepository.save(mt)
            }

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
    }

    fun getNextOrderValue(): Int {
        return (mealTimeRepository.findMaxOrder() ?: 0) + 1
    }
}

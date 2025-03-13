package com.mealplanner.Service

import com.mealplanner.Data.Day
import com.mealplanner.Repositories.DayRepository
import org.springframework.stereotype.Service

@Service
class DayService(private val dayRepository: DayRepository) {

    fun getAllDays(): List<Day> {
        return dayRepository.findAll()
    }

    fun getDayById(id: Long): Day? {
        return dayRepository.findById(id).orElse(null)
    }

    fun createDay(day: Day): Day {
        return dayRepository.save(day)
    }

    fun updateDay(id: Long, updatedMealDay: Day): Day? {
        return if (dayRepository.existsById(id)) {
            dayRepository.save(updatedMealDay.copy(id = id))
        } else {
            null
        }
    }
}

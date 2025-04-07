package com.mealplanner.repositories

import com.mealplanner.data.Food
import com.mealplanner.data.Meal
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MealRepository : JpaRepository<Meal, Long> {
    fun findByFood(food: Food): List<Meal>

}

package com.mealplanner.Repositories

import com.mealplanner.Data.Food
import com.mealplanner.Data.Meal
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MealRepository : JpaRepository<Meal, Long> {
    fun findByFood(food: Food): List<Meal>

}

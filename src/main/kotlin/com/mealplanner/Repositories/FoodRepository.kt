package com.mealplanner.Repositories

import com.mealplanner.Data.Food
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface FoodRepository : JpaRepository<Food, Long> {
    fun findByName(name: String): Food?
}
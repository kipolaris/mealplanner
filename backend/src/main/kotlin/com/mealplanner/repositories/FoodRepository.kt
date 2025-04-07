package com.mealplanner.repositories

import com.mealplanner.data.Food
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface FoodRepository : JpaRepository<Food, Long> {
    fun findByName(name: String): Food?
}
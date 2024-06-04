package com.mealplanner.Repositories

import com.mealplanner.Data.Food
import org.springframework.data.jpa.repository.JpaRepository

interface FoodRepository : JpaRepository<Food, Long>

package com.mealplanner.Repositories

import com.mealplanner.Data.Meal
import org.springframework.data.jpa.repository.JpaRepository

interface MealRepository : JpaRepository<Meal, Long>

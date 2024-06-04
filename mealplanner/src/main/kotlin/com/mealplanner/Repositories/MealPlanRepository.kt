package com.mealplanner.Repositories

import com.mealplanner.Data.MealPlan
import org.springframework.data.jpa.repository.JpaRepository

interface MealPlanRepository : JpaRepository<MealPlan, Long>

package com.mealplanner.Repositories

import com.mealplanner.Data.MealPlan
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MealPlanRepository : JpaRepository<MealPlan, Long>

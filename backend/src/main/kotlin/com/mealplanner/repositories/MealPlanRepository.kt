package com.mealplanner.repositories

import com.mealplanner.data.MealPlan
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MealPlanRepository : JpaRepository<MealPlan, Long>

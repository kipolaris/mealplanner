package com.mealplanner.Repositories

import com.mealplanner.Data.MealTime
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MealTimeRepository : JpaRepository<MealTime, Long>

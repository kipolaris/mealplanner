package com.mealplanner.Repositories

import com.mealplanner.Data.MealDay
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MealDayRepository : JpaRepository<MealDay, Long>

package com.mealplanner.Repositories

import com.mealplanner.Data.MealTime
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface MealTimeRepository : JpaRepository<MealTime, Long> {
    @Query("SELECT COALESCE(MAX(m.order), 0) FROM MealTime m")
    fun findMaxOrder(): Int?
}

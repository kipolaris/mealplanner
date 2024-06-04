package com.mealplanner.Repositories

import com.mealplanner.Data.Day
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface DayRepository : JpaRepository<Day, Long>

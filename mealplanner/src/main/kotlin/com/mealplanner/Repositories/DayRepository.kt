package com.mealplanner.Repositories

import com.mealplanner.Data.Day
import org.springframework.data.jpa.repository.JpaRepository

interface DayRepository : JpaRepository<Day, Long>

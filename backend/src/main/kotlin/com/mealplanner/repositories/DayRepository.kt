package com.mealplanner.repositories

import com.mealplanner.data.Day
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface DayRepository : JpaRepository<Day, Long>

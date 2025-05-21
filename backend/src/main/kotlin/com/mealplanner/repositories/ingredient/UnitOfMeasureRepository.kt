package com.mealplanner.repositories.ingredient

import com.mealplanner.data.ingredient.UnitOfMeasure
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UnitOfMeasureRepository : JpaRepository<UnitOfMeasure,Long>
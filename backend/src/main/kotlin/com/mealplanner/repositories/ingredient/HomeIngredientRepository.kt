package com.mealplanner.repositories.ingredient

import com.mealplanner.data.ingredient.HomeIngredient
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface HomeIngredientRepository : JpaRepository<HomeIngredient, Long>
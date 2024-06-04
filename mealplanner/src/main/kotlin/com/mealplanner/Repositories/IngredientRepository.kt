package com.mealplanner.Repositories

import com.mealplanner.Data.Ingredient
import org.springframework.data.jpa.repository.JpaRepository

interface IngredientRepository : JpaRepository<Ingredient, Long>

package com.mealplanner.repositories.ingredient

import com.mealplanner.data.ingredient.Ingredient
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface IngredientRepository : JpaRepository<Ingredient, Long>

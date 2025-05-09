package com.mealplanner.repositories.ingredient

import com.mealplanner.data.ingredient.FoodIngredient
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface FoodIngredientRepository : JpaRepository<FoodIngredient, Long>
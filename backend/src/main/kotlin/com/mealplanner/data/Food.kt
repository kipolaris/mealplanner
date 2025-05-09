package com.mealplanner.data

import com.mealplanner.data.ingredient.FoodIngredient
import com.mealplanner.data.ingredient.Ingredient
import jakarta.persistence.*

@Entity
data class Food(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long?,
    val name: String,
    val description: String? = null,
    @OneToMany(mappedBy = "food", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var ingredients: MutableList<FoodIngredient> = mutableListOf()
)


package com.mealplanner.data

import com.fasterxml.jackson.annotation.JsonManagedReference
import com.mealplanner.data.ingredient.FoodIngredient
import com.mealplanner.data.ingredient.Ingredient
import jakarta.persistence.*

@Entity
data class Food(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long?,
    val name: String,

    @Lob
    @Column(columnDefinition = "TEXT")
    val description: String? = null,

    @OneToMany(mappedBy = "foodId", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var ingredients: MutableList<FoodIngredient> = mutableListOf()
)


package com.mealplanner.data.ingredient

import jakarta.persistence.*

@Entity
data class HomeIngredient(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @OneToOne
    @JoinColumn(name = "ingredient_id")
    val ingredient: Ingredient? = null,

    val quantity: String = ""
)

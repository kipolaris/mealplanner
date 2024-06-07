package com.mealplanner.Data

import jakarta.persistence.*

@Entity
data class Ingredient(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,
    val name: String,
    val quantity: String,
    @ManyToOne
    @JoinColumn(name = "food_id")
    var food: Food? = null
)

package com.mealplanner.data.ingredient

import jakarta.persistence.*

@Entity
data class Ingredient(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,
    val name: String
)

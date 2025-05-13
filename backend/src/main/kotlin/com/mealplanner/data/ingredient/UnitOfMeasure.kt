package com.mealplanner.data.ingredient

import jakarta.persistence.*

@Entity
data class UnitOfMeasure(
    @Id @GeneratedValue val id: Long? = null,
    val name: String,
    val abbreviation: String,
    val type: String,
    val multiplierToBase: Double
)

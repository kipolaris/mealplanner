package com.mealplanner.Data

import jakarta.persistence.*

@Entity
data class MealTime(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val name: String,

    @Column(name = "meal_order", nullable = false)
    var order: Int = 0
)

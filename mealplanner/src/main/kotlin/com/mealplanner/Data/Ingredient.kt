package com.mealplanner.Data

import jakarta.persistence.*
import org.springframework.data.annotation.Id

@Entity
data class Ingredient(
    @jakarta.persistence.Id @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,
    val name: String,
    val quantity: String,
    @ManyToOne
    @JoinColumn(name = "food_id")
    var food: Food? = null
)

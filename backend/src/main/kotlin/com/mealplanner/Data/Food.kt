package com.mealplanner.Data

import jakarta.persistence.*

@Entity
data class Food(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long?,
    val name: String,
    val description: String? = null,
    @OneToMany(cascade = [CascadeType.ALL])
    val ingredients: MutableList<Ingredient>? = null
)


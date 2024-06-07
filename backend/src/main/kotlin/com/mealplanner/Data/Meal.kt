package com.mealplanner.Data

import jakarta.persistence.*

@Entity
data class Meal(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,
    val name: String,
    @ManyToMany(cascade = [CascadeType.ALL])
    @JoinTable(
        name = "meal_foods",
        joinColumns = [JoinColumn(name = "meal_id")],
        inverseJoinColumns = [JoinColumn(name = "food_id")]
    )
    val foods: MutableList<Food> = mutableListOf()
)


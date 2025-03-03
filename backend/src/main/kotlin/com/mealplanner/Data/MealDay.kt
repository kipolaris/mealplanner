package com.mealplanner.Data

import jakarta.persistence.*

@Entity
data class MealDay(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    val name: String,
    @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    @JoinColumn(name = "meal_day_id")
    var meals: MutableList<Meal> = mutableListOf()
)

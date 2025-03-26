package com.mealplanner.Data

import jakarta.persistence.*

@Entity
data class Meal(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = 1,

    @ManyToMany
    @JoinTable(
        name = "meal_food",
        joinColumns = [JoinColumn(name = "meal_id")],
        inverseJoinColumns = [JoinColumn(name = "food_id")]
    )
    val foods: MutableList<Food> = mutableListOf(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mealtime_id")
    val mealTime: MealTime,

    @Column(name = "day_id")
    val dayId: Long
)
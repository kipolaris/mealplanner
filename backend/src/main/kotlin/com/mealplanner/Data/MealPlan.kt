package com.mealplanner.Data

import jakarta.persistence.*

@Entity
data class MealPlan(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 1, // Singleton ID
    @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_plan_id")
    val days: MutableList<Day> = mutableListOf(),
    @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_plan_id")
    var mealTimes : MutableList<MealTime> = mutableListOf()
)

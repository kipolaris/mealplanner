package com.mealplanner.Data

import jakarta.persistence.*

@Entity
data class MealDay(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    val name: String,
    @OneToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "breakfast_id")
    var breakfast: Meal? = null,
    @OneToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "lunch_id")
    var lunch: Meal? = null,
    @OneToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "dinner_id")
    var dinner: Meal? = null
)

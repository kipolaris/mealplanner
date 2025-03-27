package com.mealplanner.Data

import jakarta.persistence.*

@Entity
data class Meal(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "food_id")
    var food: Food?,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mealtime_id")
    val mealTime: MealTime,

    @Column(name = "day_id")
    val dayId: Long
)
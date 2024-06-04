package com.mealplanner.Data

import jakarta.persistence.*
import org.springframework.data.annotation.Id

@Entity
data class MealPlan(
    @jakarta.persistence.Id @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,
    @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_plan_id")
    val days: MutableList<Day> = mutableListOf()
)
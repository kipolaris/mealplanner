package com.mealplanner.Data

import jakarta.persistence.*
import org.springframework.data.annotation.Id

@Entity
data class Meal(
    @jakarta.persistence.Id @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
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


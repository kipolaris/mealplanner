package com.mealplanner.Data

import jakarta.persistence.*

@Entity
@Table(name = "days")
data class Day(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    val name: String,

    @OneToMany(mappedBy = "day", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val meals: MutableList<Meal> = mutableListOf()
)

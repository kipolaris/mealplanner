package com.mealplanner.Data

import jakarta.persistence.*
import org.springframework.data.annotation.Id

@Entity
data class Day(
    @jakarta.persistence.Id @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,
    val name: String,
    @OneToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "breakfast_id")
    val breakfast: Meal? = null,
    @OneToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "lunch_id")
    val lunch: Meal? = null,
    @OneToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "dinner_id")
    val dinner: Meal? = null
)

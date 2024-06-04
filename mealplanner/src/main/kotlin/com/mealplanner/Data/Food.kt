package com.mealplanner.Data

import jakarta.persistence.*
import org.springframework.data.annotation.Id

@Entity
data class Food(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,
    val name: String,
    val description: String,
    @OneToMany(mappedBy = "food", cascade = [CascadeType.ALL], orphanRemoval = true)
    val ingredients: MutableList<Ingredient> = mutableListOf()
)


package com.mealplanner.data.ingredient

import com.fasterxml.jackson.annotation.JsonBackReference
import com.mealplanner.data.Food
import jakarta.persistence.*

@Entity
data class FoodIngredient(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "food_id")
    val foodId: Long? = null,

    @OneToOne
    @JoinColumn(name = "ingredient_id")
    val ingredient: Ingredient? = null,

    val amount: Double,
    @ManyToOne val unit: UnitOfMeasure
)

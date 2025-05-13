package com.mealplanner.data.ingredient

import com.mealplanner.data.Food
import jakarta.persistence.*

@Entity
data class FoodIngredient(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_id")
    val food: Food? = null,

    @OneToOne
    @JoinColumn(name = "ingredient_id")
    val ingredient: Ingredient? = null,

    val amount: Double,
    @ManyToOne val unit: UnitOfMeasure
)

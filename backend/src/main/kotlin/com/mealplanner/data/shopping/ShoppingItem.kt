package com.mealplanner.data.shopping

import com.mealplanner.data.ingredient.Ingredient
import com.mealplanner.data.ingredient.UnitOfMeasure
import jakarta.persistence.*

@Entity
data class ShoppingItem(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne
    @JoinColumn(name = "ingredient_id")
    val ingredient: Ingredient,

    var amount: Double,

    @ManyToOne
    val unit: UnitOfMeasure,

    val price: Double,

    @ManyToOne
    val currency: Currency,

    val checked: Boolean = false
)
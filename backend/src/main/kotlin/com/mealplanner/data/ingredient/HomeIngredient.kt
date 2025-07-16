package com.mealplanner.data.ingredient

import com.fasterxml.jackson.annotation.JsonFormat
import jakarta.persistence.*
import java.time.LocalDate

@Entity
data class HomeIngredient(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @OneToOne
    @JoinColumn(name = "ingredient_id")
    val ingredient: Ingredient? = null,

    var amount: Double,
    @ManyToOne val unit: UnitOfMeasure,

    @JsonFormat(pattern = "yyyy-MM-dd")
    var expirationDate: LocalDate? = null
)

package com.mealplanner.data.shopping

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id

@Entity
data class Currency(
    @Id @GeneratedValue val id: Long? = null,
    val name: String,
    val abbreviation: String,
    val symbol: String
)
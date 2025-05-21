package com.mealplanner.data.shopping

import jakarta.persistence.*

@Entity
data class ShoppingList(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 1,

    @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    @JoinColumn(name = "shopping_list_id")
    var items: MutableList<ShoppingItem> = mutableListOf()
)

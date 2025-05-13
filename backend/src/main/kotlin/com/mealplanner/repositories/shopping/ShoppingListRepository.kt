package com.mealplanner.repositories.shopping

import com.mealplanner.data.shopping.ShoppingList
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ShoppingListRepository : JpaRepository<ShoppingList,Long>
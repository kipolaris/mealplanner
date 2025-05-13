package com.mealplanner.repositories.shopping

import com.mealplanner.data.shopping.ShoppingItem
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ShoppingItemRepository : JpaRepository<ShoppingItem, Long>
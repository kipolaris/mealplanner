package com.mealplanner.repositories.shopping

import com.mealplanner.data.shopping.Currency
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CurrencyRepository : JpaRepository<Currency, Long>
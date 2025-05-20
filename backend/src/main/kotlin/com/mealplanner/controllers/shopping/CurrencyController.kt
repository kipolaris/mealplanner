package com.mealplanner.controllers.shopping

import com.mealplanner.data.shopping.Currency
import com.mealplanner.service.shopping.CurrencyService
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/currencies")
@CrossOrigin
class CurrencyController(
    private val currencyService: CurrencyService
) {
    @GetMapping
    fun getAll(): List<Currency> = currencyService.getCurrencies()
}
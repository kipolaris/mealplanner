package com.mealplanner.service.shopping

import com.mealplanner.data.shopping.Currency
import com.mealplanner.repositories.shopping.CurrencyRepository
import jakarta.annotation.PostConstruct
import org.springframework.stereotype.Service

@Service
class CurrencyService(
    private val currencyRepository: CurrencyRepository
) {
    fun getCurrencies(): List<Currency> {
        return currencyRepository.findAll()
    }

    fun getCurrencyById(id: Long): Currency {
        return currencyRepository.findById(id).orElseThrow { RuntimeException("Currency not found") }
    }

    fun initializeCurrencies(): List<Currency> {
        val predefinedCurrencies = listOf(
            Currency(name = "American Dollar", abbreviation = "USD", symbol = "$"),
            Currency(name = "Hungarian Forint", abbreviation = "HUF", symbol = "Ft"),
            Currency(name = "Euro", abbreviation = "EUR", symbol = "€" ),
            Currency(name = "British Pound", abbreviation = "GBP", symbol = "£"),
            Currency(name = "Swiss Franc", abbreviation = "CHF", symbol = "CHF"),
            Currency(name = "Romanian Leu", abbreviation = "RON", symbol = "lei"),
            Currency(name = "Czech Koruna", abbreviation = "CZK", symbol = "Kč"),
            Currency(name = "Polish Złoty", abbreviation = "PLN", symbol = "zł")
        )

        return currencyRepository.saveAll(predefinedCurrencies)
    }

    @PostConstruct
    fun initializeIfEmpty() {
        if (currencyRepository.count() == 0L) {
            initializeCurrencies()
            println("Initialized currencies.")
        }
    }
}
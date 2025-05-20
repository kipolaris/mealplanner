package com.mealplanner.service.shopping

import com.mealplanner.data.shopping.ShoppingItem
import com.mealplanner.repositories.ingredient.IngredientRepository
import com.mealplanner.repositories.ingredient.UnitOfMeasureRepository
import com.mealplanner.repositories.shopping.CurrencyRepository
import com.mealplanner.repositories.shopping.ShoppingItemRepository
import org.springframework.stereotype.Service

@Service
class ShoppingItemService(
    private val shoppingItemRepository: ShoppingItemRepository,
    private val ingredientRepository: IngredientRepository,
    private val unitOfMeasureRepository: UnitOfMeasureRepository,
    private val currencyRepository: CurrencyRepository
) {
    fun createShoppingItem(ingredientId: Long, amount: Double, unitId: Long, price: Double, currencyId: Long): ShoppingItem {
        val ingredient = ingredientRepository.findById(ingredientId).orElseThrow { RuntimeException("Ingredient not found") }
        val unit = unitOfMeasureRepository.findById(unitId).orElseThrow { RuntimeException("Unit of measure not found") }
        val currency = currencyRepository.findById(currencyId).orElseThrow { RuntimeException("Currency not found") }

        val shoppingItem = ShoppingItem(
            id = null,
            ingredient = ingredient,
            amount = amount,
            unit = unit,
            price = price,
            currency = currency,
            checked = false
        )

        return shoppingItemRepository.save(shoppingItem)
    }

    fun updateShoppingItem(id: Long, ingredientId: Long, amount: Double, unitId: Long, price: Double, currencyId: Long, checked: Boolean): ShoppingItem {
        val existing = shoppingItemRepository.findById(id).orElseThrow { RuntimeException("Shopping item not found") }
        val ingredient = ingredientRepository.findById(ingredientId).orElseThrow { RuntimeException("Ingredient not found") }
        val unit = unitOfMeasureRepository.findById(unitId).orElseThrow { RuntimeException("Unit of measure not found") }
        val currency = currencyRepository.findById(currencyId).orElseThrow { RuntimeException("Currency not found") }

        val updated = existing.copy(ingredient = ingredient, amount = amount, unit = unit, price = price, currency = currency, checked = checked)

        return shoppingItemRepository.save(updated)
    }

    fun deleteShoppingItem(id: Long) {
        val shoppingItem = shoppingItemRepository.findById(id).orElseThrow { RuntimeException("Shopping item not found") }

        shoppingItemRepository.delete(shoppingItem)
    }
}
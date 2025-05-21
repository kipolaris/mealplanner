package com.mealplanner.service.shopping

import com.mealplanner.data.shopping.ShoppingList
import com.mealplanner.repositories.shopping.ShoppingListRepository
import com.mealplanner.service.ingredient.UnitOfMeasureService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ShoppingListService(
    private val shoppingListRepository: ShoppingListRepository,
    private val unitOfMeasureService: UnitOfMeasureService,
    private val shoppingItemService: ShoppingItemService
) {
    private val shoppingListId = 1L
    fun getShoppingList(): ShoppingList {
        return shoppingListRepository.findById(shoppingListId).orElseGet {
            val shoppingList = ShoppingList(id = shoppingListId)
            shoppingListRepository.save(shoppingList)
        }
    }

    fun resetShoppingList(): ShoppingList {
        val shoppingList = getShoppingList()

        shoppingList.items.forEach { shoppingItem ->
            shoppingItem.id?.let { shoppingItemService.deleteShoppingItem(it) }
        }

        shoppingList.items.clear()

        return shoppingListRepository.save(shoppingList)
    }

    @Transactional
    fun addShoppingItemToList(ingredientId: Long, amount: Double, unitId: Long, price: Double, currencyId: Long): ShoppingList {
        val shoppingList = getShoppingList()

        val newItem = shoppingItemService.createShoppingItem(
            ingredientId,
            amount,
            unitId,
            price,
            currencyId
        )

        shoppingList.items.add(newItem)
        return shoppingListRepository.save(shoppingList)
    }

    fun deleteShoppingItemFromList(shoppingItemId: Long): ShoppingList {
        val shoppingList = getShoppingList()
        val shoppingItem = shoppingList.items.find { it.id == shoppingItemId } ?: throw RuntimeException("Shopping item not found")

        shoppingList.items.remove(shoppingItem)
        shoppingItemService.deleteShoppingItem(shoppingItemId)

        return shoppingListRepository.save(shoppingList)
    }

    fun updateShoppingItemInList(shoppingItemId: Long, ingredientId: Long, amount: Double, unitId: Long, price: Double, currencyId: Long, checked: Boolean): ShoppingList {
        val shoppingList = getShoppingList()
        val updated = shoppingItemService.updateShoppingItem(shoppingItemId,ingredientId,amount,unitId,price, currencyId, checked)

        val index = shoppingList.items.indexOfFirst { it.id == updated.id }
        if (index != -1) {
            shoppingList.items[index] = updated
        }

        return shoppingListRepository.save(shoppingList)
    }

    fun mergeShoppingItemInList(ingredientId: Long, amount: Double, unitId: Long, price: Double, currencyId: Long): ShoppingList {
        val shoppingList = getShoppingList()
        val unit = unitOfMeasureService.getUnitById(unitId)

        val existing = shoppingList.items.find { it.ingredient.id == ingredientId && it.unit.type == unit.type && it.currency.id == currencyId}
            ?: throw RuntimeException("There are no ingredients in the shopping list like this")

        val convertedAmount = unitOfMeasureService.convert(amount, unitId, existing.unit.id!!)

        val newTotal = existing.amount + convertedAmount

        val newPrice = existing.price + price

        return updateShoppingItemInList(existing.id!!, existing.ingredient.id, newTotal, existing.unit.id, newPrice, currencyId, false)
    }
}
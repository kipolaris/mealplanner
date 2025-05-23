package com.mealplanner.controllers.shopping

import com.mealplanner.data.shopping.ShoppingList
import com.mealplanner.service.shopping.ShoppingListService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/shopping-list")
@CrossOrigin
class ShoppingListController(private val shoppingListService: ShoppingListService) {
    data class ShoppingItemRequest(
        val ingredientId: Long,
        val amount: Double,
        val unitId: Long,
        val price: Double,
        val currencyId: Long,
        val checked: Boolean
    )

    @GetMapping
    fun getShoppingList(): ResponseEntity<ShoppingList> {
        val shoppingList = shoppingListService.getShoppingList()
        println("Fetched shopping list: $shoppingList")
        return ResponseEntity.ok(shoppingList)
    }

    @PostMapping("/reset")
    fun resetShoppingList(): ResponseEntity<ShoppingList> {
        return ResponseEntity.ok(shoppingListService.resetShoppingList())
    }

    @PostMapping
    fun addShoppingItemToList(@RequestBody request: ShoppingItemRequest): ResponseEntity<ShoppingList> {
        return ResponseEntity.ok(shoppingListService.addShoppingItemToList(
            request.ingredientId,
            request.amount,
            request.unitId,
            request.price,
            request.currencyId
        ))
    }

    @DeleteMapping("/{id}")
    fun deleteShoppingItemFromList(
        @PathVariable id: Long
    ): ResponseEntity<Unit> {
        shoppingListService.deleteShoppingItemFromList(id)
        return ResponseEntity.noContent().build()
    }

    @PutMapping("/{id}")
    fun updateShoppingItemInList(@PathVariable id: Long, @RequestBody request: ShoppingItemRequest): ResponseEntity<ShoppingList> {
        return ResponseEntity.ok(shoppingListService.updateShoppingItemInList(
            id,
            request.ingredientId,
            request.amount,
            request.unitId,
            request.price,
            request.currencyId,
            request.checked
        ))
    }

    @PutMapping("/merge")
    fun mergeShoppingItemInList(@RequestBody request: ShoppingItemRequest): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(shoppingListService.mergeShoppingItemInList(request.ingredientId, request.amount, request.unitId, request.price, request.currencyId))
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }
}
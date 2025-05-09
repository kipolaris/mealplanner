package com.mealplanner.controllers

import com.mealplanner.data.Food
import com.mealplanner.service.FoodService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/foods")
@CrossOrigin
class FoodController(val foodService: FoodService) {
    data class FoodIngredientRequest(
        val ingredientId: Long,
        val quantity: String
    )

    @GetMapping
    fun getAllFoods(): List<Map<String, Any>> {
        return foodService.getAllFoods().map { food ->
            mapOf("id" to (food.id ?: "none"), "name" to food.name)
        }
    }


    @GetMapping("/{id}")
    fun getFoodById(@PathVariable id: Long): ResponseEntity<Food> {
        return foodService.getFoodById(id)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }

    @PostMapping
    fun createFood(@RequestBody food: Food): ResponseEntity<Food> {
        val createdFood = foodService.createFood(food)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdFood)
    }

    @PutMapping("/{id}")
    fun updateFood(@PathVariable id: Long, @RequestBody food: Food): ResponseEntity<Food> {
        return foodService.updateFood(id, food)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    fun deleteFood(@PathVariable id: Long): ResponseEntity<Unit> {
        foodService.deleteFood(id)
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/{id}/ingredients")
    fun addIngredientToFood(
        @PathVariable id: Long,
        @RequestBody request: FoodIngredientRequest
    ): ResponseEntity<Food> {
        val food = foodService.addIngredientToFood(id, request.ingredientId, request.quantity)
        return ResponseEntity.ok(food)
    }

    @PutMapping("/{id}/ingredients")
    fun updateIngredientInFood(
        @PathVariable id: Long,
        @RequestBody request: FoodIngredientRequest
    ): ResponseEntity<Food> {
        val food = foodService.updateIngredientInFood(id, request.ingredientId, request.quantity)
        return ResponseEntity.ok(food)
    }


    @DeleteMapping("/{id}/ingredients")
    fun deleteIngredientFromFood(
        @PathVariable id: Long,
        @RequestBody request: FoodIngredientRequest
    ): ResponseEntity<Unit> {
        foodService.deleteIngredientFromFood(id, request.ingredientId)
        return ResponseEntity.noContent().build()
    }
}

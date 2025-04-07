package com.mealplanner.controllers

import com.mealplanner.data.Food
import com.mealplanner.data.Ingredient
import com.mealplanner.service.FoodService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/foods")
@CrossOrigin
class FoodController(val foodService: FoodService) {

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
    fun addIngredientToFood(@PathVariable id: Long, @RequestBody ingredient: Ingredient): ResponseEntity<Food> {
        return foodService.addIngredientToFood(id, ingredient)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }
}

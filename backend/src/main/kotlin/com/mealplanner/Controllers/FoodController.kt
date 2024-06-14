package com.mealplanner.Controllers

import com.mealplanner.Data.Food
import com.mealplanner.Data.Ingredient
import com.mealplanner.Service.FoodService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/foods")
@CrossOrigin
class FoodController(private val foodService: FoodService) {

    @GetMapping
    fun getAllFoods(): List<Food> {
        return foodService.getAllFoods()
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
    fun deleteFood(@PathVariable id: Long): ResponseEntity<Void> {
        return if (foodService.deleteFood(id)) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping("/{id}/ingredients")
    fun addIngredientToFood(@PathVariable id: Long, @RequestBody ingredient: Ingredient): ResponseEntity<Food> {
        return foodService.addIngredientToFood(id, ingredient)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }
}

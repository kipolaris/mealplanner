package com.mealplanner.controllers

import com.mealplanner.data.Food
import com.mealplanner.data.Meal
import com.mealplanner.service.MealService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/meals")
@CrossOrigin
class MealController(private val mealService: MealService) {

    @GetMapping
    fun getAllMeals(): List<Meal> {
        return mealService.getAllMeals()
    }

    @GetMapping("/{id}")
    fun getMealById(@PathVariable id: Long): ResponseEntity<Meal> {
        return mealService.getMealById(id)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }

    @PostMapping
    fun createMeal(@RequestBody meal: Map<String, Any>): ResponseEntity<Meal?> {
        println("Received meal: $meal")
        //TODO
        return ResponseEntity.status(HttpStatus.CREATED).body(null)
    }

    @PutMapping("/{id}")
    fun updateMeal(@PathVariable id: Long, @RequestBody meal: Meal): ResponseEntity<Meal> {
        return mealService.updateMeal(id, meal)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    fun deleteMeal(@PathVariable id: Long): ResponseEntity<Unit> {
        return if (mealService.deleteMeal(id)) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping("/{mealId}/foods/{mealDayId}")
    fun addFoodToMeal(
        @PathVariable mealId: Long,
        @PathVariable mealDayId: Long,
        @RequestBody food: Food
    ): ResponseEntity<Meal> {
        return mealService.addFoodToMeal(mealId, food)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{mealId}/foods/{mealDayId}/{foodId}")
    fun removeFoodFromMeal(
        @PathVariable mealId: Long,
        @PathVariable mealDayId: Long,
        @PathVariable foodId: Long
    ): ResponseEntity<Meal> {
        return mealService.removeFoodFromMeal(mealId, foodId)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }
}
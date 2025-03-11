package com.mealplanner.Controllers

import com.mealplanner.Data.Food
import com.mealplanner.Data.Meal
import com.mealplanner.Service.MealService
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
    fun createMeal(@RequestBody meal: Meal): ResponseEntity<Meal> {
        val createdMeal = mealService.createMeal(meal)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMeal)
    }

    @PutMapping("/{id}")
    fun updateMeal(@PathVariable id: Long, @RequestBody meal: Meal): ResponseEntity<Meal> {
        return mealService.updateMeal(id, meal)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    fun deleteMeal(@PathVariable id: Long): ResponseEntity<Void> {
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
        return mealService.addFoodToMeal(mealId, mealDayId, food)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{mealId}/foods/{mealDayId}/{foodId}")
    fun removeFoodFromMeal(
        @PathVariable mealId: Long,
        @PathVariable mealDayId: Long,
        @PathVariable foodId: Long
    ): ResponseEntity<Meal> {
        return mealService.removeFoodFromMeal(mealId, mealDayId, foodId)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }
}
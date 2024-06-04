package com.mealplanner.Controllers

import com.mealplanner.Data.MealPlan
import com.mealplanner.Service.MealPlanService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/meal-plan")
class MealPlanController(private val mealPlanService: MealPlanService) {

    @GetMapping
    fun getMealPlan(): ResponseEntity<MealPlan> {
        return ResponseEntity.ok(mealPlanService.getMealPlan())
    }

    @PostMapping("/reset")
    fun resetMealPlan(): ResponseEntity<MealPlan> {
        return ResponseEntity.ok(mealPlanService.resetMealPlan())
    }

    @DeleteMapping("/meals/{mealId}/foods/{foodId}")
    fun removeFoodFromMeal(@PathVariable mealId: Long, @PathVariable foodId: Long): ResponseEntity<MealPlan> {
        return ResponseEntity.ok(mealPlanService.removeFoodFromMeal(mealId, foodId))
    }
}

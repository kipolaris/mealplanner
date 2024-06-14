package com.mealplanner.Controllers

import com.mealplanner.Data.MealDay
import com.mealplanner.Data.Meal
import com.mealplanner.Data.MealPlan
import com.mealplanner.Service.MealPlanService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/meal-plan")
@CrossOrigin
class MealPlanController(private val mealPlanService: MealPlanService) {

    @GetMapping
    fun getMealPlan(): ResponseEntity<MealPlan> {
        return ResponseEntity.ok(mealPlanService.getMealPlan())
    }

    @PostMapping("/reset")
    fun resetMealPlan(): ResponseEntity<MealPlan> {
        return ResponseEntity.ok(mealPlanService.resetMealPlan())
    }

    @PutMapping("/days/{dayId}/meals/{mealType}")
    fun updateMealInDay(@PathVariable dayId: Long, @PathVariable mealType: String, @RequestBody meal: Meal): ResponseEntity<MealDay> {
        return mealPlanService.updateMealInDay(dayId, mealType, meal)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }

    @DeleteMapping("/days/{dayId}/meals/{mealType}/foods/{foodId}")
    fun removeFoodFromMeal(@PathVariable dayId: Long, @PathVariable mealType: String, @PathVariable foodId: Long): ResponseEntity<MealDay> {
        return mealPlanService.removeFoodFromMeal(dayId, mealType, foodId)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }
}

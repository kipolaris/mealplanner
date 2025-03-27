package com.mealplanner.Controllers

import com.mealplanner.Data.Day
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
    fun resetMealPlan(@RequestBody mealTimesRequest: Map<String, List<Map<String, String>>>): ResponseEntity<MealPlan> {
        return ResponseEntity.ok(mealPlanService.resetMealPlan(mealTimesRequest))
    }


    @PutMapping("/days/{dayId}/meals/{mealType}")
    fun updateMealInDay(@PathVariable dayId: Long, @PathVariable mealType: String, @RequestBody meal: Meal): ResponseEntity<Day> {
        return mealPlanService.updateMealInDay(dayId, mealType, meal)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }

    @DeleteMapping("/days/{dayId}/meals/{mealId}/foods/{foodId}")
    fun removeFoodFromMeal(@PathVariable dayId: Long, @PathVariable mealId: Long, @PathVariable foodId: Long): ResponseEntity<Day> {
        return mealPlanService.removeFoodFromMeal(dayId, mealId, foodId)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }

    @PutMapping
    fun updateMealPlan(@RequestBody updatedMealPlan: MealPlan): ResponseEntity<MealPlan> {
        println(updatedMealPlan)
        return ResponseEntity.ok(mealPlanService.updateMealPlan(updatedMealPlan))
    }
}

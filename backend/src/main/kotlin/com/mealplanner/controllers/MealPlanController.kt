package com.mealplanner.controllers

import com.mealplanner.data.Day
import com.mealplanner.data.Meal
import com.mealplanner.data.MealPlan
import com.mealplanner.data.MealTime
import com.mealplanner.service.MealPlanService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/meal-plan")
@CrossOrigin
class MealPlanController(private val mealPlanService: MealPlanService) {

    @GetMapping
    fun getMealPlan(): ResponseEntity<MealPlan> {
        val mealPlan = mealPlanService.getMealPlan()
        println("Fetched meal plan: $mealPlan")
        return ResponseEntity.ok(mealPlanService.getMealPlan())
    }

    @PostMapping("/reset")
    fun resetMealPlan(@RequestBody mealTimesRequest: Map<String, List<Map<String, String>>>): ResponseEntity<MealPlan> {
        return ResponseEntity.ok(mealPlanService.resetMealPlan(mealTimesRequest))
    }

    @PostMapping("/reset-meal-time")
    fun resetMealTime(@RequestBody mealTime: MealTime): ResponseEntity<MealPlan> {
        return ResponseEntity.ok(mealPlanService.resetMealTime(mealTime))
    }

    @PostMapping("/reset-day")
    fun resetDay(@RequestBody day: Day): ResponseEntity<MealPlan> {
        return ResponseEntity.ok(mealPlanService.resetDay(day))
    }

    @PostMapping("/reset-meal")
    fun resetMeal(@RequestBody meal: Meal): ResponseEntity<MealPlan> {
        return ResponseEntity.ok(mealPlanService.resetMeal(meal))
    }

    @PutMapping
    fun updateMealPlan(@RequestBody updatedMealPlan: MealPlan): ResponseEntity<MealPlan> {
        println("Updated meal plan received from frontend: $updatedMealPlan")
        return ResponseEntity.ok(mealPlanService.updateMealPlan(updatedMealPlan))
    }
}

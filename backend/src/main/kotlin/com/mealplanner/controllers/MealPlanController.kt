package com.mealplanner.controllers

import com.mealplanner.data.MealPlan
import com.mealplanner.data.mealtime.MealTime
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

    @PutMapping
    fun updateMealPlan(@RequestBody updatedMealPlan: MealPlan): ResponseEntity<MealPlan> {
        println("Updated meal plan received from frontend: $updatedMealPlan")
        return ResponseEntity.ok(mealPlanService.updateMealPlan(updatedMealPlan))
    }
}

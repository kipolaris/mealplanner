package com.mealplanner.Controllers

import com.mealplanner.Data.MealDay
import com.mealplanner.Service.MealDayService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/mealdays")
@CrossOrigin
class MealDayController(private val mealDayService: MealDayService) {

    @GetMapping
    fun getAllMealDays(): List<MealDay> {
        return mealDayService.getAllMealDays()
    }

    @GetMapping("/{id}")
    fun getMealDayById(@PathVariable id: Long): ResponseEntity<MealDay> {
        return mealDayService.getMealDayById(id)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }

    @PostMapping
    fun createMealDay(@RequestBody mealDay: MealDay): ResponseEntity<MealDay> {
        val createdMealDay = mealDayService.createMealDay(mealDay)
        return ResponseEntity.ok(createdMealDay)
    }

    @PutMapping("/{id}")
    fun updateMealDay(@PathVariable id: Long, @RequestBody mealDay: MealDay): ResponseEntity<MealDay> {
        return mealDayService.updateMealDay(id, mealDay)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }
}

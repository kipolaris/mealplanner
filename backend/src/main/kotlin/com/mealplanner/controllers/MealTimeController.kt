package com.mealplanner.controllers

import com.mealplanner.data.MealTime
import com.mealplanner.data.ReorderRequest
import com.mealplanner.service.MealTimeService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/mealtimes")
@CrossOrigin
class MealTimeController(private val mealTimeService: MealTimeService) {

    @GetMapping
    fun getAll(): List<MealTime> {
        return mealTimeService.getAllMealTimes()
    }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): ResponseEntity<MealTime> {
        return mealTimeService.getMealTimeById(id)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }

    @PostMapping
    fun create(@RequestBody mealTime: Map<String, Any>): ResponseEntity<MealTime?> {
        println("Received mealTime: $mealTime")
        val name = mealTime["name"] as? String ?: ""

        val nextOrder = mealTimeService.getNextOrderValue()

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(mealTimeService.createMealTime(MealTime(id = null, name = name, order = nextOrder)))
    }


    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody mealTime: MealTime): ResponseEntity<MealTime> {
        return mealTimeService.updateMealTime(id, mealTime)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Unit> {
        return if (mealTimeService.deleteMealTime(id)) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PutMapping("/reorder")
    fun reorderMealTimes(@RequestBody request: ReorderRequest): ResponseEntity<List<MealTime>> {
        mealTimeService.reorderMealTimes(request.mealTimeId1, request.mealTimeId2)
        return ResponseEntity.ok(mealTimeService.getAllMealTimes())
    }

}
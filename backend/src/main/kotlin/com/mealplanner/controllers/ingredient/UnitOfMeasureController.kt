package com.mealplanner.controllers.ingredient

import com.mealplanner.data.ingredient.UnitOfMeasure
import com.mealplanner.service.ingredient.UnitOfMeasureService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/units")
@CrossOrigin
class UnitOfMeasureController(
    private val unitOfMeasureService: UnitOfMeasureService
) {
    @GetMapping
    fun getAll(): List<UnitOfMeasure> = unitOfMeasureService.getUnitsOfMeasure()
}

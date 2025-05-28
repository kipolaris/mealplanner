package com.mealplanner.service.ingredient

import com.mealplanner.data.ingredient.UnitOfMeasure
import com.mealplanner.repositories.ingredient.UnitOfMeasureRepository
import jakarta.annotation.PostConstruct
import org.springframework.stereotype.Service

@Service
class UnitOfMeasureService(
    private val unitOfMeasureRepository: UnitOfMeasureRepository
) {
    fun getUnitsOfMeasure(): List<UnitOfMeasure> {
        return unitOfMeasureRepository.findAll()
    }

    fun getUnitById(id: Long): UnitOfMeasure {
        return unitOfMeasureRepository.findById(id).orElseThrow { RuntimeException("Unit of measure not found") }
    }

    fun initializeUnitsOfMeasure(): List<UnitOfMeasure> {
        val predefinedUnits = listOf(
            // Mass (base: gram)
            UnitOfMeasure(name = "milligram", abbreviation = "mg", type = "mass", multiplierToBase = 0.001),
            UnitOfMeasure(name = "gram", abbreviation = "g", type = "mass", multiplierToBase = 1.0),
            UnitOfMeasure(name = "decagram", abbreviation = "dg", type = "mass", multiplierToBase = 10.0),
            UnitOfMeasure(name = "kilogram", abbreviation = "kg", type = "mass", multiplierToBase = 1000.0),

            // Volume (base: milliliter)
            UnitOfMeasure(name = "milliliter", abbreviation = "ml", type = "volume", multiplierToBase = 1.0),
            UnitOfMeasure(name = "deciliter", abbreviation = "dl", type = "volume", multiplierToBase = 100.0),
            UnitOfMeasure(name = "liter", abbreviation = "l", type = "volume", multiplierToBase = 1000.0),

            // Custom (non-convertible)
            UnitOfMeasure(name = "cup", abbreviation = "cup", type = "custom", multiplierToBase = 1.0),
            UnitOfMeasure(name = "bag", abbreviation = "bag", type = "custom", multiplierToBase = 1.0),
            UnitOfMeasure(name = "pack", abbreviation = "pack", type = "custom", multiplierToBase = 1.0),
            UnitOfMeasure(name = "teaspoon", abbreviation = "tsp", type = "custom", multiplierToBase = 1.0),
            UnitOfMeasure(name = "tablespoon", abbreviation = "tbsp", type = "custom", multiplierToBase = 1.0),
            UnitOfMeasure(name = "carton", abbreviation = "carton", type = "custom", multiplierToBase = 1.0),
            UnitOfMeasure(name = "bottle", abbreviation = "bottle", type = "custom", multiplierToBase = 1.0),
            UnitOfMeasure(name = "bowl", abbreviation = "bowl", type = "custom", multiplierToBase = 1.0),
            UnitOfMeasure(name = "slice", abbreviation = "slice", type = "custom", multiplierToBase = 1.0),
            UnitOfMeasure(name = "piece", abbreviation = "piece", type = "custom", multiplierToBase = 1.0)
        )

        return unitOfMeasureRepository.saveAll(predefinedUnits)
    }

    fun convert(amount: Double, fromId: Long, toId: Long): Double {
        val from = unitOfMeasureRepository.findById(fromId).orElseThrow()
        val to = unitOfMeasureRepository.findById(toId).orElseThrow()
        require(from.type == to.type) { "Cannot convert between types" }
        return (amount * from.multiplierToBase) / to.multiplierToBase
    }

    @PostConstruct
    fun initializeIfEmpty() {
        if (unitOfMeasureRepository.count() == 0L) {
            initializeUnitsOfMeasure()
            println("Initialized units of measure.")
        }
    }
}
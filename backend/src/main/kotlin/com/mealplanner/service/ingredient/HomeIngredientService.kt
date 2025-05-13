package com.mealplanner.service.ingredient

import com.mealplanner.data.ingredient.HomeIngredient
import com.mealplanner.data.ingredient.UnitOfMeasure
import com.mealplanner.repositories.ingredient.HomeIngredientRepository
import com.mealplanner.repositories.ingredient.IngredientRepository
import org.springframework.stereotype.Service
import kotlin.RuntimeException

@Service
class HomeIngredientService(
    private val homeIngredientRepository: HomeIngredientRepository,
    private val ingredientRepository: IngredientRepository,
    private val unitOfMeasureService: UnitOfMeasureService
) {
    fun getAllHomeIngredients(): List<HomeIngredient> {
        return homeIngredientRepository.findAll()
    }

    fun getHomeIngredientById(id: Long): HomeIngredient? {
        return homeIngredientRepository.findById(id).orElse(null)
    }

    fun getByIngredientId(ingredientId: Long): HomeIngredient? {
        return homeIngredientRepository.findAll().find { it.ingredient?.id == ingredientId }
    }

    fun createHomeIngredient(ingredientId: Long, amount: Double, unitId: Long): HomeIngredient {
        val ingredient = ingredientRepository.findById(ingredientId).orElseThrow { RuntimeException("Ingredient not found")}
        val unit = unitOfMeasureService.getUnitById(unitId)

        val homeIngredient = HomeIngredient(
            id = null,
            ingredient = ingredient,
            amount = amount,
            unit = unit
        )
        return homeIngredientRepository.save(homeIngredient)
    }

    fun updateHomeIngredient(id: Long, amount: Double, unitId: Long): HomeIngredient {
        val existing = homeIngredientRepository.findById(id).orElseThrow { RuntimeException("Home ingredient not found") }
        val unit = unitOfMeasureService.getUnitById(unitId)
        val updated = existing.copy(amount = amount, unit=unit)
        return homeIngredientRepository.save(updated)
    }

    fun deleteHomeIngredient(id: Long) {
        val homeIngredient = homeIngredientRepository.findById(id).orElseThrow { RuntimeException("Home ingredient not found") }
        homeIngredientRepository.delete(homeIngredient)
    }

    fun mergeHomeIngredient(ingredientId: Long, amount: Double, unitId: Long): HomeIngredient {
        val homeIngredients = homeIngredientRepository.findAll()
        val unit = unitOfMeasureService.getUnitById(unitId)

        val existing = homeIngredients.find { it.ingredient?.id == ingredientId && it.unit.type == unit.type }
            ?: throw RuntimeException("There are no ingredients at home like this")

        val convertedAmount = unitOfMeasureService.convert(amount, unitId, existing.unit.id!!)

        val newTotal = existing.amount + convertedAmount

        return updateHomeIngredient(existing.id!!, newTotal, existing.unit.id)
    }
}
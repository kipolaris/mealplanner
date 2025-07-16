package com.mealplanner.service.ingredient

import com.mealplanner.data.ingredient.HomeIngredient
import com.mealplanner.data.ingredient.UnitOfMeasure
import com.mealplanner.repositories.ingredient.HomeIngredientRepository
import com.mealplanner.repositories.ingredient.IngredientRepository
import org.springframework.stereotype.Service
import java.time.LocalDate
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

    fun deleteByIngredientId(ingredientId: Long) {
        val hi = getByIngredientId(ingredientId)
        if (hi != null) {
            hi.id?.let { deleteHomeIngredient(it) }
        }
    }

    fun createHomeIngredient(ingredientId: Long, amount: Double, unitId: Long, expirationDate: LocalDate?): HomeIngredient {
        val ingredient = ingredientRepository.findById(ingredientId).orElseThrow { RuntimeException("Ingredient not found")}
        val unit = unitOfMeasureService.getUnitById(unitId)

        val existing = homeIngredientRepository.findAll().find {
            it.ingredient?.id == ingredientId && it.unit.type == unit.type
        }
        if (existing != null) {
            throw RuntimeException("Ingredient already exists with same unit type")
        }

        val homeIngredient = HomeIngredient(
            id = null,
            ingredient = ingredient,
            amount = amount,
            unit = unit,
            expirationDate = expirationDate
        )
        return homeIngredientRepository.save(homeIngredient)
    }

    fun updateHomeIngredient(id: Long, amount: Double, unitId: Long, expirationDate: LocalDate?): HomeIngredient {
        val existing = homeIngredientRepository.findById(id).orElseThrow { RuntimeException("Home ingredient not found") }
        val unit = unitOfMeasureService.getUnitById(unitId)
        val updated = existing.copy(amount = amount, unit=unit, expirationDate = expirationDate)
        return homeIngredientRepository.save(updated)
    }

    fun deleteHomeIngredient(id: Long) {
        val homeIngredient = homeIngredientRepository.findById(id).orElseThrow { RuntimeException("Home ingredient not found") }
        homeIngredientRepository.delete(homeIngredient)
    }

    fun mergeHomeIngredient(ingredientId: Long, amount: Double, unitId: Long, expirationDate: LocalDate?): HomeIngredient {
        val homeIngredients = homeIngredientRepository.findAll()
        val unit = unitOfMeasureService.getUnitById(unitId)

        val existing = homeIngredients.find { it.ingredient?.id == ingredientId && it.unit.type == unit.type }
            ?: throw RuntimeException("There are no ingredients at home like this")

        val convertedAmount = unitOfMeasureService.convert(amount, unitId, existing.unit.id!!)

        val newTotal = existing.amount + convertedAmount

        val mergedExpiration = when {
            expirationDate == null -> existing.expirationDate
            existing.expirationDate == null -> expirationDate
            else -> minOf(existing.expirationDate!!, expirationDate)
        }

        return updateHomeIngredient(existing.id!!, newTotal, existing.unit.id, mergedExpiration)
    }
}
package com.mealplanner.controllers.ingredient

import com.mealplanner.data.ingredient.HomeIngredient
import com.mealplanner.service.ingredient.HomeIngredientService
import jakarta.persistence.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDate

@RestController
@RequestMapping("/api/home-ingredients")
@CrossOrigin
class HomeIngredientController(
    private val homeIngredientService: HomeIngredientService
) {
    data class HomeIngredientRequest(
        val ingredientId: Long,
        val amount: Double,
        val unitId: Long,
        val expirationDate: LocalDate? = null
    )
    @GetMapping
    fun getAllHomeIngredients(): List<HomeIngredient> {
        return homeIngredientService.getAllHomeIngredients()
    }

    @GetMapping("/{id}")
    fun getHomeIngredientById(@PathVariable id: Long): ResponseEntity<HomeIngredient> {
        return homeIngredientService.getHomeIngredientById(id)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }

    @GetMapping("/by-ingredient/{ingredientId}")
    fun getByIngredientId(@PathVariable ingredientId: Long): ResponseEntity<HomeIngredient> {
        val result = homeIngredientService.getByIngredientId(ingredientId)
        return if (result != null) {
            ResponseEntity.ok(result)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping
    fun createHomeIngredient(@RequestBody request: HomeIngredientRequest): ResponseEntity<Any> {
        return try {
            val created = homeIngredientService.createHomeIngredient(
                request.ingredientId,
                request.amount,
                request.unitId,
                request.expirationDate
            )
            ResponseEntity.status(HttpStatus.CREATED).body(created)
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }

    @PutMapping("/{id}")
    fun updateHomeIngredient(
        @PathVariable id: Long,
        @RequestBody request: HomeIngredientRequest
    ) : ResponseEntity<HomeIngredient> {
        val homeIngredient = homeIngredientService.updateHomeIngredient(id, request.amount, request.unitId, request.expirationDate)
        return ResponseEntity.ok(homeIngredient)
    }

    @DeleteMapping("/{id}")
    fun deleteHomeIngredient(@PathVariable id: Long): ResponseEntity<Unit> {
        homeIngredientService.deleteHomeIngredient(id)
        return ResponseEntity.noContent().build()
    }

    @PutMapping("/merge")
    fun mergeHomeIngredient(@RequestBody request: HomeIngredientRequest): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(homeIngredientService.mergeHomeIngredient(request.ingredientId,request.amount,request.unitId, request.expirationDate))
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }
}
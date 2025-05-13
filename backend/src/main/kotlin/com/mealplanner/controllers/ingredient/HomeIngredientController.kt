package com.mealplanner.controllers.ingredient

import com.mealplanner.data.ingredient.HomeIngredient
import com.mealplanner.service.ingredient.HomeIngredientService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/home-ingredients")
@CrossOrigin
class HomeIngredientController(
    private val homeIngredientService: HomeIngredientService
) {
    data class HomeIngredientRequest(
        val ingredientId: Long,
        val amount: Double,
        val unitId: Long
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
                request.unitId
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
        val homeIngredient = homeIngredientService.updateHomeIngredient(id, request.amount, request.unitId)
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
            ResponseEntity.ok(homeIngredientService.mergeHomeIngredient(request.ingredientId,request.amount,request.unitId))
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }
}
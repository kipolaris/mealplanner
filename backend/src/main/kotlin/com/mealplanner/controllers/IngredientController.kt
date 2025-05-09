package com.mealplanner.controllers

import com.mealplanner.data.Ingredient
import com.mealplanner.service.IngredientService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/ingredients")
@CrossOrigin
class IngredientController(private val ingredientService: IngredientService) {

    @GetMapping
    fun getAllIngredients(): List<Ingredient> {
        return ingredientService.getAllIngredients()
    }

    @GetMapping("/{id}")
    fun getIngredientById(@PathVariable id: Long): ResponseEntity<Ingredient> {
        return ingredientService.getIngredientById(id)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }

    @PostMapping
    fun createIngredient(@RequestBody ingredient: Ingredient): ResponseEntity<Ingredient> {
        val createdIngredient = ingredientService.createIngredient(ingredient)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdIngredient)
    }

    @PutMapping("/{id}")
    fun updateIngredient(@PathVariable id: Long, @RequestBody ingredient: Ingredient): ResponseEntity<Ingredient> {
        return ingredientService.updateIngredient(id, ingredient)?.let {
            ResponseEntity.ok(it)
        } ?: ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    fun deleteIngredient(@PathVariable id: Long): ResponseEntity<Unit> {
        ingredientService.deleteIngredient(id)
        return ResponseEntity.noContent().build()
    }
}
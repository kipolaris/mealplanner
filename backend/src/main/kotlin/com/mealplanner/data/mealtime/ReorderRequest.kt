package com.mealplanner.data.mealtime


data class ReorderRequest(val mealTimeId1: Long, val mealTimeId2: Long, val mealPlanId: Long)

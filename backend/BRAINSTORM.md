# Meal Planner

## Description
Meal Planner is an organizational web application where you can plan your meals in advance. The application is made in Spring Boot Kotlin, and uses React for the frontend.

## Spring Boot dependencies
- Web
- Reactive web
- H2 database
- Spring data JPA
- Dev tools
- Thymeleaf

## Functions
- You can plan for a week in advance what you're gonna eat for each meal during a day.
- You can add new meals to the default meals (Breakfast, Lunch, Dinner)
- You can keep track of the ingredients needed for preparing a meal
- You can keep track of what ingredients you have at home
- You can keep track of what food you have at home
- You can keep track of what items you want to buy

## Structure
### Pages:
- Main menu
- Meal plan
- Ingredients at home
- Food at home
- Foods

### Main menu:
- You can navigate to the other pages from here.

### Meal plan:
- Consists of 4 views
- First view is a table containing the meals, the days, and the foods assigned to them
- Second view is a profile for the food, containing its ingredients
- Third view shows the different meals of a specific day
- Fourth view shows the different foods assigned to a specific meal during the entire week

### Ingredients/Food at home: 
- Simple pages for managing the specific lists

### Foods:
- A page containing a list of all the foods saved by the user
  

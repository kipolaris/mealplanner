# Forkcast
Forkcast is a website which  gives you the ability to plan your meals ahead for each day of the week.

## Features
- You can add, remove and reorder meals, foods and ingredients.
- You can assign foods to each meal.
- You can reset the meal plan and the foods of the selected day or meal.
- You can view a selected day and its foods for each meal.
- You can view a selected meal and its foods for each day.
- You can assign ingredients to each food with quantities.
- You can add ingredients to your shopping list with quantities and prices.
- You can save ingredients you have at home.

## Structure
- Landing page: The first page of the website which, for now, contains placeholder text for logging in or registering account.
- How-to page: A page which contains a guide for using the website, not yet available.
- Main page: Table containing each day in the first row, and each meal time in the first column.
  - You can add meal times using the plus button in the last row of the table.
  - You can reorder meal times using the arrow buttons next to their names.
  - You can add foods to each meal time and day combination by clicking the cells in the table.
    - When you click a cell a modal pops up where you can select existing foods or add a new food.
      - You can delete food items by clicking the trash can icon next to the food's name in the existing food dropdown.
  - You can open the meal time page or the day page by clicking on their name.
  - You can reset the meal plan with the reset button in the first cell of the table.
  - There's a menu page which contains the following:
    - Meal Plan page
    - Meal times page
    - Foods page
    - Ingredients page
    - Ingredients at home page
    - Shopping list page
- Meal time page: A page where you can view the selected meal time's foods for each day.
- Day page: A page where you can view the selected day's foods for each meal time.
- Shopping list page: A page where you can view the shopping list and it's contents. You can add ingredients here with quantities and prices.
- Foods page: A list of the existing food items where you can edit their names, add a description, delete them, and assign ingredients to them with quantities.
- Ingredients page: A list of the ingredients you have at home where you can edit their names and quantities, as well as delete them.

## Technology

### Backend

| Component         | Technology |
|------------------|------------|
| Framework        | Spring Boot |
| Language         | Kotlin |
| Database        | H2 (in-memory) |
| Build Tool       | Gradle |
| Reactive Programming | Spring WebFlux, Reactor |

### Frontend

| Component        | Technology |
|-----------------|------------|
| Library         | React |
| Language        | JavaScript |
| Styling        | CSS |


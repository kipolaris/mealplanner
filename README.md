# Meal Planner
Meal Planner is a website which  gives you the ability to plan your meals ahead for each day of the week.

## Features
- You can add, remove and reorder meals, foods and ingredients.
- You can assign foods to each meal.
- You can sign up and log in to the site.
- You can reset the meal plan, the foods of the selected day or meal, and the shopping list.
- You can view a selected day and its foods for each meal.
- You can view a selected meal and its foods for each day.
- You can assign ingredients to each food with quantities, expiration dates and prices.
- You can select a food and add its ingredients to your shopping list.
- You can export the shopping list as pdf.
- You can save ingredients you have at home and check what kind of foods you can make using them.
- You can view a calendar which contains your previous, current and future meal plans.
- You can change the theme of the website, and the font and size of the text.
- You can change the language of the website.

## Structure
- Login/Signup page: The first page of the website where you can either create an account or log in to an existing account, as well as view the How-to page.
  - Each account has a username, a display name, an e-mail address and a password. You can log in using either the username or the e-mail address.
- How-to page: A page which contains a guide for using the website.
- Main page: Table containing each day in the first row, and each meal in the first column.
  - You can add meals using the plus button in the last row of the table.
  - You can reorder meals using the arrow buttons next to their names.
  - You can add foods to each meal and day combination by clicking the cells in the table.
    - When you click a cell a modal pops up where you can select existing foods or add a new food.
      - You can delete food items by clicking the trash can icon next to the food's name in the existing food dropdown.
  - You can open the meal view or the day view by clicking on the meal/day.
  - You can reset the meal plan with the reset button in the first cell of the table.
  - The navbar has a dropdown menu which contains the following:
    - Meal Plan page
    - Shopping list page
    - Foods page
    - Ingredients page
    - How-to page
    - Calendar page
    - Account page
    - Sign out button.
- Meal page: A page where you can view the selected meal's foods for each day. Next to the meal's name there's a dropdown menu which contains the options to edit or delete the meal.
- Day page: A page where you can view the selected day's foods for each meal.
- Shopping list page: A page where you can view the shopping list and it's contents. You can add ingredients of existing foods here.
- Foods page: A list of the existing food items where you can edit their names, add a description, delete them, and assign ingredients to them with quantities, prices and expiration dates.
- Ingredients page: A list of the ingredients you have at home where you can edit their names, quantities, prices and expiration dates, as well as delete them.
- Calendar page: A calendar which gives you the ability to navigate between past, current and future meal plans.
- Account page: A page where you can edit your display name, your username, your e-mail address, your password and your profile picture. You can also change the language of the website.

## Technology

### Backend

| Component         | Technology |
|------------------|------------|
| Framework        | Spring Boot |
| Language         | Kotlin |
| Database        | H2 (in-memory) |
| Build Tool       | Gradle |
| Reactive Programming | Spring WebFlux, Reactor |
| Template Engine | Thymeleaf |

### Frontend

| Component        | Technology |
|-----------------|------------|
| Library         | React |
| Language        | JavaScript |
| Styling        | CSS |


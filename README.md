# Pokemon-Catalog
A web application for a simple Pokemon catalog using Next.js, React, GraphQL, and Apollo GraphQL with Typescript.

Below are the detailed requirements for the assignment:

Requirements:

Use Next.js with React for the project.
Utilize the 'pages' directory for the project structure.
Retrieve data from the GraphQL API: https://graphql-pokemon2.vercel.app/.
API documentation: https://wayfair.github.io/dociql/.
Use Apollo Client library to fetch data from the API.
Host the application on Vercel (free hosting).


Features:

Homepage:

List all available Pokemon with pagination (20 Pokemon per page).
Display each Pokemon's image, number, name, and types.
Refer to https://www.pokemon.com/us/pokedex/ for layout inspiration.
Statically render the first three paginated pages at build time.
Render the remaining pages in real-time.

Pokemon detail page:

Display name, image, height, weight, classification, type, weakness, and resistance of the Pokemon.
Include a button to open a popup showing the Pokemon's evolutions.
Query evolution data only when the button is clicked, not beforehand.
Refer to https://www.pokemon.com/us/pokedex/bulbasaur for an example of a Pokemon detail page.
Statically render the detail pages for the first 20 Pokemon at build time.

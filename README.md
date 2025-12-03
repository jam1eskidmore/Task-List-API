# Take-Home Coding Assignment: Simple Task List API

By: Jamie Skidmore jamieskid@gmail.com

## How to install dependencies, build, and run the project:

Follow the instructions below to get the project up and running on your machine.

### Clone the git repo

1. Create a new directory called "project"
2. Inside this new directoy, run the following commands, which will install the project inside a folder called "Task-List-API":
   `git init`
   `git clone https://github.com/jam1eskidmore/Task-List-API`

### Install dependencies (must have Node and npm [installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))

1. Inside `project/Task-List-API`, run `npm i` to install dependencies

### Build the project

1. Create a file called `.env`. The path for this file should be `project/Task-List-API/.env`.
2. Ensure that the `.env` file contains the following contents: `DATABASE_URL="file:./prisma/dev.db"`
3. Now, inside `project/Task-List-API`, run `npx prisma generate` to establish a connection to the database.

### Run the project

1. From `project/Task-List-API` run `npm run dev`
2. Visit [localhost:4000](http://localhost:4000/) on your web browser. You can now run GraphQL queries in Apollo Sandbox.
3. Test a query:
   `query {
  tasks {
    id
    title
    completed
    createdAt
    updatedAt
  }
}`.

## Bonus: Improving error handling

One way to improve error handling would be to create a handleError function to use within the `schema.ts` file. This function would take the error and attempted operation as parameters, returning custom error messages based on the input. The handleError function would improve the project by reducing repetition within the query and mutation functions.

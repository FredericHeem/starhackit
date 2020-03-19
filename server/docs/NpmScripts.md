# Workflow with npm scripts

These are the main *npm* commands during a standard developer workflow:

| npm command    | details  |
|----------------|----------|
| `npm install`  | Install dependencies  |
| `npm run setup`  | Install Redis and Postgresql docker containers  |
| `npm start`    | Start the backend  |
| `npm run mocha`|  Run the tests once|
| `npm run mocha:watch`|  Run the tests and restart when code changes |
| `npm test`     |  Run the tests and generate a code coverage |
| `npm run db:create`| Create the database 
| `npm run db:drop`| Drop the database
| `npm run db:migrate`| Run the sql migration
| `npm run db:recreate`| Drop and create the database
| `npm run docker:build`| Build the api docker image
| `npm run docker:up`| Start all docker containers: postgres and redis
| `npm run docker:down`| Stop all containers
| `npm run docker:destroy`| Destoy dockers containers and storage

| `npm run mock`  |  Run a mock server based on the RAML api definition |
| `npm run doc` |  Generate the API HTML documentation |
| `npm run opendoc` |  Open the API HTML documentation |
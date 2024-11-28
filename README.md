# Northcoders News API

This is my first hosted Backend project! The endpoints were built with the idea of making a website where users can create and vote on articles to share content based on topics!

Here is the link to the project: https://mithril-news.onrender.com/api

Under this endpoint you will find all other available endpoints, optional queries and how those can be used.

# Step 1:
    Key notes:
        -   ensure that you have the latest version of Node installed (I was using node -v 23+)
        -   ensure that you have the latest version of Posgres installed (I was using psql (PostgreSQL) 14.13 (Ubuntu 14.13-0ubuntu0.22.04.1))

    If you wish to update your Node or Posgres use the following commands for Node and Posgres respectively:

    Node:
        -   nvm install node 
        -   nvm use node
        -   nvm alias default node

    //to update: remind yourself how you installed posgres 
    
# Step 2: setup .env files

Explanation: there will be two datasets we will primarily be working with: dev and test. These will be from the json objects found in /db/data/development-data and /db/data/test-data respectively

Create two .env files and paste the contents following their respective semicolon within them (if in doubt there is a .env-example file that contains the type of content we expect): 

    - 1 .env.development: PGDATABASE=nc_news
    - 2 .env.test: PGDATABASE=nc_news_test

# Final step: All good to go!

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)



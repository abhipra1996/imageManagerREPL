# imageManagerREPL

A Node.js based Command Line REPL (Read Evaluate Print Loop) that implements a location based image manager with some basic functionalities.

## Technical Specifications

-   Language - JavaScript
-   Runtime Environment - Node.js
-   DB - Postgresql
-   DB Hosting - AWS RDS
-   ORM - Typeorm

## Steps To Run the Command Line REPL

```sh
yarn
node app.js
```

## List Of Functionalities

-   ADD_IMAGE <filename> <location> <X> <Y>
-   ADD_LOCATION <location> <X> <Y>
-   REMOVE_IMAGE <filename>
-   REMOVE_LOCATION <location>
-   LIST_ALL_IMAGES
-   LIST_ALL_LOCATIONS
-   LIST_IMAGES_BY_LOCATION <locationQuery>
-   SEARCH_IMAGES_BY_COORD <XQuery> <YQuery> <distance>
-   HELP (To list details of all the commands)

All command arguments are space separated.

# SpaceMafiaAmongUs
Final Project

## Introduction
Space Mafia Among Us is a web-based game where two teams, innocents and traitors, fight to win the game through discussion and psychological analysis. It is a social deduction game heavily inspired by the game, The Resistance: Avalon. Its nominal theme is also inspired by two very popular games: Mafia and Among Us. Each player is assigned to either team and the goal of each team is to successfully finish three out of five quests.

## Technologies Used

1. NodeJS + Express : Back-end server code; manages all the modules.
2. PassportJS : Manages user authentication including login and signup.
3. VueJS + HTML + CSS : Front-end user interface.
4. Axios : HTTP requests from front-end to server. (authentication)
5. SocketIO: In-game communication between server and client.
6. MongoDB: Database of users and cookie session information.

## Developer Setup
1. clone git repository

``` 
git clone https://github.com/jthnl/SpaceMafiaAmongUs 
```
2. install mongo db locally:

```
https://docs.mongodb.com/manual/administration/install-community/
```
3. install NodeJS dependencies
```
$ npm install
```
4.  install front-end dependencies
```
npm run prepare
```
5. start server
``` 
npm start
```
6. view webpage
```
http://localhost:3000
```

## Future Work
1. Add more in-depth user roles: Merlin, Assasin, other special roles.
2. Improve user authentication security: proper salt + hash + encryption; 3rd party authentication.
3. Improve graphics and animation.

<!-- ## Gameplay
![Login](photos/Login.png)


![Account](photos/Account.png)

![Gameplay](photos/gameplay.png) -->

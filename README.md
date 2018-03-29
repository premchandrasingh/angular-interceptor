# AngularInterceptor

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.0.

## Target Understanding of this project
This POC project is to understand the auto refreshing of token when current token is found expired during the course of UI making API calls without breaking the continuity the API call

    Note:-
    Login and just notice that token life count down. Open the developer tool bar and notice the api calls when token life count down reached 0.

## Development server

Run `npm start` instead of `ng serve` for both UI server and API server. 

    Note:- 
    The response in this API will never return an http error instead actual error will be wrapped in the API response like

    {"status":401,"message":"Expired or invalid token."}



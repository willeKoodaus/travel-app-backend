# TravelApp - Backend

## Idea behind the app
TravelApp is a travel planning application where users can register, log in, and plan their trips with details like flights, accommodations, activities, and packing lists. It helps to keep all the trip details in one place, so you do not need to check everything from multiple different applications. Application consists of frontend, backend and authentication server.

## Who is it for?
TravelApp is for anyone who likes to travel. It is especially good for travelers who prefer to plan their trip by themselves instead of trusting travel agencies. These kind of travelers often book flights, accommodation and activities all from separate websites.

## Where to find the app?
Application can be accessed online at:
[https://white-ocean-068e14d03.3.azurestaticapps.net/](https://white-ocean-068e14d03.3.azurestaticapps.net/)

## How to use the app?
App is meant for individual use so you can test it by yourself. Currently there is no possibility to share trip details with others. Here's how to use the app:
1. First you will arrive to the Login page. If you have not used the app before, click "Sign up" link below the login form.
![image](https://github.com/willeKoodaus/travel-app-backend/assets/94905760/b688331c-dd47-4d0d-bd77-4f5bed509795)
3. Enter user name (it can include letters, numbers and special characters), your email address and password.
4. If registration is succesful, you will see a notification tellign that and will be transferred back to the Login page. Here you can login with the email and password you just entered when creating an account.
5. Next you will come to "My trips" page. Click "Add trip" to add a trip and give destination and travel dates. Finally click "Create trip".
6. Now you should see the trip you just added on "My trips" page. By clicking anywhere in the trip container you can go to the page of the individual trip. You can also edit the destination or dates if you wish by clickin "Edit".
![image](https://github.com/willeKoodaus/travel-app-backend/assets/94905760/bed753e8-58cc-4d95-9754-479512dc601a)
7. Once you have clicked on individual trip, you will be directed to the page where you will see more details of that specific trip.
![image](https://github.com/willeKoodaus/travel-app-backend/assets/94905760/1f64c844-0fee-42a9-9687-05f94442834b)
Features of individual trip page:
   * Add, edit and remove fligh details (airline, fligth number, departure date, return date, departure airport and arrival airport)
   * Add, edit and remove accommodation details (name, address, arrival date, departure date, booking confirmation number)
   * Add and remove activities. You can add name, date, location and description for each activity.
   * Add and remove items on/from packing list.
   * AI Generated list of 5 suggested attractions in your trip destination. This list might take a while to load.
8. Finally when you are finished editing trip details you can click "Back to my trips" at the bottom of the page.
9. If you do not wish to add any more trips, you can log out from the "Log out" button at the bottom of the "My trips" page.

## Technical Stack
* GraphQL
* MongoDB
* Express.js
* Node.js
* TypeScript

## Dependencies
Refer to the package.json file for a detailed list of dependencies.

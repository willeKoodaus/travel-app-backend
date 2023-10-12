/* eslint-disable node/no-unpublished-import */
import request from 'supertest';
import expect from 'expect';
import { TripTest } from '../src/interfaces/Trip';  // Assuming you have this interface setup similar to CatTest
import { UserTest } from '../src/interfaces/User';  // Existing import from your example
import '@testing-library/jest-dom';
require('dotenv').config();

// Helper function to create a new trip
const postTrip = (
  url: string | Function,
  trip: TripTest,
  user: UserTest,
  token: string
): Promise<TripTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation CreateTrip($input: TripInput!) {
          createTrip(input: $input) {
            id
            user {
              user_name
            }
            startDate
            endDate
            destination
          }
        }`,
        variables: {
            input: {
              user: user.id,
              startDate: trip.startDate,
              endDate: trip.endDate,
              destination: trip.destination,
            },
        }
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log("tripFunctions line 48",response.body.data);
          const newTrip = response.body.data.createTrip;
          expect(newTrip).toHaveProperty('id');
          expect(newTrip).toHaveProperty('user');
          expect(newTrip).toHaveProperty('startDate');
          expect(newTrip).toHaveProperty('endDate');
          expect(newTrip).toHaveProperty('destination');
          resolve(newTrip);
        }
      });
  });
};

// Helper function to retrieve all trips
const getTrips = (url: string | Function, token: string): Promise<TripTest[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `query {
          trips {
            id
            user {
              user_name
            }
            startDate
            endDate
            destination
          }
        }`,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const trips = response.body.data.trips;
          expect(trips).toBeInstanceOf(Array);
          resolve(trips);
        }
      });
  });
};

// Helper function to retrieve a single trip by ID
const getSingleTrip = (url: string | Function, id: string, token: string): Promise<TripTest> => {
    return new Promise((resolve, reject) => {
      request(url)
        .post('/graphql')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `query TripById($id: ID!) {
            tripById(id: $id) {
              id
            }
          }`,
          variables: { id: id },
        })
        .expect(200, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.body.data.tripById);
          }
        });
    });
  };
  
  // Helper function to update a trip
  const userPutTrip = (
    url: string | Function,
    id: string,
    input: TripTest,
    token: string
  ): Promise<TripTest> => {
    return new Promise((resolve, reject) => {
      request(url)
        .post('/graphql')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `mutation UpdateTrip($id: ID!, $input: updateTripInput) {
            updateTrip(id: $id, input: $input) {
              id
            }
          }`,
          variables: { id: id,  input: {
            destination: input.destination,
          }, }
        })
        .expect(200, (err, response) => {
          if (err) {
            reject(err);
          } else {
            const newTrip = response.body.data.updateTrip;
            expect(newTrip).toHaveProperty('id');
            resolve(newTrip);
            resolve(response.body.data.updateTrip);
          }
        });
    });
  };
  
  // Helper function to attempt updating a trip with wrong user or incorrect input
const wrongUserPutTrip = (
    url: string | Function,
    id: string,
    input: TripTest,
    token: string
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      request(url)
        .post('/graphql')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `mutation UpdateTrip($id: ID!, $input: updateTripInput) {
            updateTrip(id: $id, input: $input) {
              id
            }
          }`,
          variables: { id: id, input: {
            destination: input.destination,
          }, }
        })
        .expect(200, (err, response) => { 
          if (err) {
            reject(err);
          } else {
            expect(response.body.errors).toBeDefined()
            expect(response.body.errors[0].message).toBe('Not authorized because userId does not match id from token');
            resolve(response.body.errors);  // Adjust as needed to match your error handling
          }
        });
    });
  };
  
  // Helper function to delete a trip
  const userDeleteTrip = (
    url: string | Function,
    id: string,
    token: string
  ): Promise<TripTest> => {
    return new Promise((resolve, reject) => {
      request(url)
        .post('/graphql')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `mutation DeleteTrip($id: ID!) {
            deleteTrip(id: $id) {
              id
            }
          }`,
          variables: { id },
        })
        .expect(200, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.body.data.deleteTrip);
          }
        });
    });
  };
  
  // Helper function to attempt deleting a trip with wrong user or unauthorized access
const wrongUserDeleteTrip = (
    url: string | Function,
    id: string,
    token: string
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      request(url)
        .post('/graphql')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `mutation DeleteTrip($id: ID!) {
            deleteTrip(id: $id) {
              id
            }
          }`,
          variables: { id },
        })
        .expect(200, (err, response) => {  // Change 400 to the expected error status code
          if (err) {
            reject(err);
          } else {
            expect(response.body.errors).toBeDefined()
            expect(response.body.errors[0].message).toBe('Not authorized because userId does not match id from token');
            resolve(response.body.errors);  // Adjust as needed to match your error handling
          }
        });
    });
  };
  
  // Helper function to retrieve all trips by a specific user
  const getTripsByUser = (
    url: string | Function,
    userId: string,
    token: string
  ): Promise<TripTest[]> => {
    return new Promise((resolve, reject) => {
      request(url)
        .post('/graphql')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `query TripsByUser($userId: ID!) {
            tripsByUser(userId: $userId) {
              id
            }
          }`,
          variables: { userId },
        })
        .expect(200, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.body.data.tripsByUser);
          }
        });
    });
  };
  
  // Exporting all functions
  export {
    postTrip,
    getTrips,
    getSingleTrip,
    userPutTrip,
    wrongUserPutTrip,
    userDeleteTrip,
    wrongUserDeleteTrip,
    getTripsByUser
  };
  

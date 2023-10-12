import app from '../src/app';
import {
  postTrip,
  getTrips,
  getSingleTrip,
  userPutTrip,
  wrongUserPutTrip,
  userDeleteTrip,
  wrongUserDeleteTrip,
  getTripsByUser
} from './tripFunctions';
import { TripTest } from '../src/interfaces/Trip';
import mongoose from 'mongoose';
import { getNotFound } from './testFunctions';
import {
  postUser,
  loginUser,
  adminDeleteUser,
  deleteUser,
  getSingleUser,
  getUser,
  putUser
} from './userFunctions';
import { UserTest } from '../src/interfaces/User';
import randomstring from 'randomstring';
import jwt from 'jsonwebtoken';
import LoginMessageResponse from '../src/interfaces/LoginMessageResponse';
import '@testing-library/jest-dom';

describe('Testing graphql api', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // test not found
  it('responds with a not found message', async () => {
    await getNotFound(app);
  });

  // test create user
  let userData: LoginMessageResponse;
  let userData2: LoginMessageResponse;
  let adminData: LoginMessageResponse;

  const testUser: UserTest = {
    user_name: 'Test User ' + randomstring.generate(7),
    email: randomstring.generate(9) + '@user.fi',
    password: 'testpassword',
  };

  const testUser2: UserTest = {
    user_name: 'Test User ' + randomstring.generate(7),
    email: randomstring.generate(9) + '@user.fi',
    password: 'testpassword',
  };

  const adminUser: UserTest = {
    email: 'admin@metropolia.fi',
    password: '12345',
  };

  // create first user
  it('should create a new user', async () => {
    await postUser(app, testUser);
  });

  // create second user to try to modify someone else's cats and userdata
  it('should create second user', async () => {
    await postUser(app, testUser2);
  });

  // test login
  it('should login user', async () => {
    userData = await loginUser(app, testUser);
  });

  // test login with second user
  it('should login second user', async () => {
    userData2 = await loginUser(app, testUser2);
  });

  // make sure token has role (so that we can test if user is admin or not)
  it('token should have role', async () => {
    console.log("moi apitestistä",userData);
    const dataFromToken = jwt.verify(
      userData.token!,
      process.env.JWT_SECRET as string
    );
    expect(dataFromToken).toHaveProperty('role');
  });

  // test get all users
  it('should return array of users', async () => {
    await getUser(app);
  });

  // test get single user
  it('should return single user', async () => {
    await getSingleUser(app, userData.user.id!);
  });

  // test update user
  it('should update user', async () => {
    await putUser(app, userData.token!);
  });

  // test trip-related functionalities
 
  const testTrip: TripTest = {
    destination: 'Test Destination ' + randomstring.generate(7),
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-01-10'),
    // ... other trip properties
  };

  // test create trip
  let tripID: string;
  it('should create a new trip', async () => {
    const trip = await postTrip(app, testTrip, userData.user!, userData.token!);
    tripID = trip.id!;
  });

// test get all trips
it('should return array of trips', async () => {
    await getTrips(app, userData.token!);
  });
  

// test get single trip
it('should return single trip', async () => {
    await getSingleTrip(app, tripID, userData.token!);
  });
  

// get trips by user id
it('should return trips by current user', async () => {
    await getTripsByUser(app, userData.user.id!, userData.token!);
  });
  

  // modify trip as wrong user
  it('should not modify a trip', async () => {
    const newTrip: TripTest = {
      destination: 'Modified Destination ' + randomstring.generate(7),
    };
    await wrongUserPutTrip(app, tripID, newTrip, userData2.token!);
  });

  // delete trip as wrong user
  it('should not delete a trip', async () => {
    await wrongUserDeleteTrip(app, tripID, userData2.token!);
  });

  // modify trip by id
  it('should modify a trip', async () => {
    const newTrip: TripTest = {
      destination: 'Modified Destination ' + randomstring.generate(7),
    };
    await userPutTrip(app, tripID, newTrip, userData.token!);
  });

  // test delete trip
  it('should delete a trip', async () => {
    await userDeleteTrip(app, tripID, userData.token!);
  });

  // test delete user based on token
  it('should delete current user', async () => {
    await deleteUser(app, userData.token!);
  });

});

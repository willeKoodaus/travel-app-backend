// flightResolvers.js
import { Types } from 'mongoose';
import flightModel from '../models/flightModel';
import { Trip } from '../../interfaces/Trip';
import tripModel from '../models/tripModel';
import { MyContext } from '../../interfaces/MyContext';  // Import MyContext
import { UserIdWithToken } from '../../interfaces/User';  // Import UserIdWithToken

export default {
  Trip: {
    flight: async (parent: Trip) => {
      return await flightModel.findById(parent.flight);
    },
  },
  Query: {
    flights: async (_parent: undefined, _args: undefined, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      const flights = await flightModel.find();
      // Fetch the associated trip for the first flight
      const trip = await tripModel.findById(flights[0].trip);
      if (trip !== null && trip.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      return flights;
    },
    flightById: async (_parent: undefined, args: { id: Types.ObjectId }, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      const flight = await flightModel.findById(args.id);
      if (flight === null) throw new Error('Flight not found');
      // Fetch the associated trip for the flight
      const trip = await tripModel.findById(flight.trip);
      if (trip !== null && trip.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      return flight;
    },
  },
  Mutation: {
    createFlight: async (_parent: undefined, args: { input: any }, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      // Fetch the associated trip for the input data
      const trip = await tripModel.findById(args.input.trip);
      if (trip !== null && trip.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      const flight = new flightModel(args.input);
      await tripModel.findByIdAndUpdate(
        args.input.trip,
        { $set: { flight: flight._id } },
        { new: true }
      );
      return await flight.save();
    },
    updateFlight: async (_parent: undefined, args: { id: Types.ObjectId, input: any }, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      const flight = await flightModel.findById(args.id);
      if (flight === null) throw new Error('Flight not found');
      // Fetch the associated trip for the flight
      const trip = await tripModel.findById(flight.trip);
      if (trip !== null && trip.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      return await flightModel.findByIdAndUpdate(args.id, args.input, { new: true });
    },
    deleteFlight: async (_parent: undefined, args: { id: Types.ObjectId }, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      const flight = await flightModel.findById(args.id);
      if (flight === null) throw new Error('Flight not found');
      // Fetch the associated trip for the flight
      const trip = await tripModel.findById(flight.trip);
      if (trip !== null && trip.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      return await flightModel.findByIdAndDelete(args.id);
    },
  },
};

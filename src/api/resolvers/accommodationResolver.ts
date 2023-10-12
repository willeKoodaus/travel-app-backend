// accommodationResolvers.js
import { Types } from 'mongoose';
import accommodationModel from '../models/accommodationModel';
import { Trip } from '../../interfaces/Trip';
import tripModel from '../models/tripModel';
import { MyContext } from '../../interfaces/MyContext';  // Import MyContext
import { UserIdWithToken } from '../../interfaces/User';  // Import UserIdWithToken

export default {
  Trip: {
    accommodation: async (parent: Trip) => {
      return await accommodationModel.findById(parent.accommodation);
    },
  },
  Query: {
    accommodations: async (_parent: undefined, _args: undefined, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      const accommodations = await accommodationModel.find();
      // Fetch the associated trip for the first accommodation
      const trip = await tripModel.findById(accommodations[0].trip);
      if (trip !== null && trip.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      return accommodations;
    },
    accommodationById: async (_parent: undefined, args: { id: Types.ObjectId }, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      const accommodation = await accommodationModel.findById(args.id);
      if (accommodation === null) throw new Error('Accommodation not found');
      // Fetch the associated trip for the accommodation
      const trip = await tripModel.findById(accommodation.trip);
      if (trip !== null && trip.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      return accommodation;
    },
  },
  Mutation: {
    createAccommodation: async (_parent: undefined, args: { input: any }, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      // Fetch the associated trip for the input data
      const trip = await tripModel.findById(args.input.trip);
      if (trip !== null && trip.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      const accommodation = new accommodationModel(args.input);
      await tripModel.findByIdAndUpdate(
        args.input.trip,
        { $set: { accommodation: accommodation._id } },
        { new: true }
      );
      return await accommodation.save();
    },
    updateAccommodation: async (_parent: undefined, args: { id: Types.ObjectId, input: any }, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      const accommodation = await accommodationModel.findById(args.id);
      if (accommodation === null) throw new Error('Accommodation not found');
      // Fetch the associated trip for the accommodation
      const trip = await tripModel.findById(accommodation.trip);
      if (trip !== null && trip.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      return await accommodationModel.findByIdAndUpdate(args.id, args.input, { new: true });
    },
    deleteAccommodation: async (_parent: undefined, args: { id: Types.ObjectId }, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      const accommodation = await accommodationModel.findById(args.id);
      if (accommodation === null) throw new Error('Accommodation not found');
      // Fetch the associated trip for the accommodation
      const trip = await tripModel.findById(accommodation.trip);
      if (trip !== null && trip.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      return await accommodationModel.findByIdAndDelete(args.id);
    },
  },
};

// tripResolvers.js
import { Types } from 'mongoose';
import tripModel from '../models/tripModel';
import { Flight } from '../../interfaces/Flight';
import { Accommodation } from '../../interfaces/Accommodation';
import { Activity } from '../../interfaces/Activity';
import { MyContext } from '../../interfaces/MyContext';  // Assuming this import is correct
import { UserIdWithToken } from '../../interfaces/User';
import activityModel from '../models/activityModel';

export default {
  Activity: {
    trip: async (parent: Activity) => {
      return await tripModel.findById(parent.trip);
    },
  },
  Flight: {
    trip: async (parent: Flight) => {
      return await tripModel.findById(parent.trip);
    },
  },
  Accommodation: {
    trip: async (parent: Accommodation) => {
      return await tripModel.findById(parent.trip);
    },
  },
  Query: {
    trips: async (_parent: undefined, _args: undefined, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      const trips = await tripModel.find({ user: context.id});
      if (trips !== null && trips[0].user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      return trips;
    },
    tripById: async (_parent: undefined, args: { id: Types.ObjectId }, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      const trip = await tripModel.findById(args.id);
      if (trip !== null && trip.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      else if (trip === null) throw new Error('Trip not found');
      return trip;
    },
    tripsByUser: async (_parent: undefined, _args: { userId: Types.ObjectId }, context: UserIdWithToken) => {
      console.log("tripResolver line 30",context);
      if (!context.id) throw new Error('Not authenticated');
      if (_args.userId.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      return await tripModel.find({ user: context.id });
    },
  },
  Mutation: {
    createTrip: async (_parent: undefined, args: { input: any }, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      if (args.input.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      const trip = new tripModel({ ...args.input, user: context.id });
      return await trip.save();
    },
    updateTrip: async (_parent: undefined, args: { id: Types.ObjectId, input: any }, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      const trip = await tripModel.findById(args.id);
      if (!trip) throw new Error('Trip not found');
      if (trip.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      return await tripModel.findByIdAndUpdate(args.id, args.input, { new: true });
    },
    deleteTrip: async (_parent: undefined, args: { id: Types.ObjectId }, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      const trip = await tripModel.findById(args.id);
      if (trip !== null && trip.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      if (!trip) throw new Error('Trip not found');
      return await tripModel.findByIdAndDelete(args.id);
    },
    addActivityToTrip: async (_parent: undefined, { tripId, input }: { tripId: Types.ObjectId, input: any }, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      const trip = await tripModel.findById(tripId);
      if (trip !== null && trip.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      const activity = new activityModel(input);
      await activity.save();
      if (!trip) throw new Error('Trip not found');
      trip.activityList.push(activity);
      return await trip.save();
    },
    removeActivityFromTrip: async (_parent: undefined, { tripId, activityId }: { tripId: Types.ObjectId, activityId: Types.ObjectId }, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      const trip = await tripModel.findById(tripId);
      if (trip !== null && trip.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      if (!trip) throw new Error('Trip not found');
      trip.activityList = trip.activityList.filter(activity => activity.toString() !== activityId.toString());
      await activityModel.findByIdAndDelete(activityId);
      return await trip.save();
    },
    addItemToPackingList: async (_parent: undefined, { tripId, item }: { tripId: Types.ObjectId, item: string }, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      const trip = await tripModel.findById(tripId);
      if (trip !== null && trip.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      if (!trip) throw new Error('Trip not found');
      trip.packingList.push(item);
      return await trip.save();
    },
    removeItemFromPackingList: async (_parent: undefined, { tripId, item }: { tripId: Types.ObjectId, item: string }, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      const trip = await tripModel.findById(tripId);
      if (trip !== null && trip.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      if (!trip) throw new Error('Trip not found');
      trip.packingList = trip.packingList.filter(i => i !== item);
      return await trip.save();
    },
  },
};

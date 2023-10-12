// activityResolvers.js
import { Types } from 'mongoose';
import activityModel from '../models/activityModel';
import { Trip } from '../../interfaces/Trip';
import tripModel from '../models/tripModel';  // Import tripModel
import { MyContext } from '../../interfaces/MyContext';  // Import MyContext
import { UserIdWithToken } from '../../interfaces/User';  // Import UserIdWithToken

export default {
  Trip: {
    activityList: async (parent: Trip) => {
      return await activityModel.find({ trip: parent.id }); 
    },
  },
  Query: {
    activities: async (_parent: undefined, _args: undefined, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      const activities = await activityModel.find();
      // Fetch the associated trip for the first activity
      const trip = await tripModel.findById(activities[0].trip);
      if (trip !== null && trip.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      return activities;
    },
    activityById: async (_parent: undefined, args: { id: Types.ObjectId }, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      const activity = await activityModel.findById(args.id);
      if (activity === null) throw new Error('Activity not found');
      // Fetch the associated trip for the activity
      const trip = await tripModel.findById(activity.trip);
      if (trip !== null && trip.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      return activity;
    },
  },
  Mutation: {
    createActivity: async (_parent: undefined, args: { input: any }, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      // Fetch the associated trip for the input data
      const trip = await tripModel.findById(args.input.trip);
      if (trip !== null && trip.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      const activity = new activityModel(args.input);
      await activity.save();  // Save the new activity
      // Update the associated trip's activityList
      if(trip === null) throw new Error('Trip not found');
      trip.activityList.push(activity.id);
      await trip.save();
      return activity;
    },
    updateActivity: async (_parent: undefined, args: { id: Types.ObjectId, input: any }, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      const activity = await activityModel.findById(args.id);
      if (activity === null) throw new Error('Activity not found');
      // Fetch the associated trip for the activity
      const trip = await tripModel.findById(activity.trip);
      if (trip !== null && trip.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      return await activityModel.findByIdAndUpdate(args.id, args.input, { new: true });
    },
    deleteActivity: async (_parent: undefined, args: { id: Types.ObjectId }, context: UserIdWithToken) => {
      if (!context.id) throw new Error('Not authenticated');
      const activity = await activityModel.findById(args.id);
      if (activity === null) throw new Error('Activity not found');
      // Fetch the associated trip for the activity
      const trip = await tripModel.findById(activity.trip);
      if (trip !== null && trip.user.toString() !== context.id) throw new Error('Not authorized because userId does not match id from token');
      return await activityModel.findByIdAndDelete(args.id);
    },
  },
};

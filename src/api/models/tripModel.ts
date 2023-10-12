import mongoose, { Schema } from 'mongoose';
import { Trip } from '../../interfaces/Trip';

const tripModel = new mongoose.Schema<Trip>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  flight: { type: Schema.Types.ObjectId, ref: 'Flight', required: false},
  accommodation: { type: Schema.Types.ObjectId, ref: 'Accommodation', required: false },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  activityList: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
  packingList: [{ type: String }],
  destination: { type: String, required: true },
});

export default mongoose.model<Trip>('Trip', tripModel);
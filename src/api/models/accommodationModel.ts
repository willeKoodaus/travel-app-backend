import mongoose from 'mongoose';
import { Accommodation } from '../../interfaces/Accommodation';
import { Schema } from 'mongoose';

const accommodationModel = new mongoose.Schema<Accommodation>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  bookingConfirmationNumber: { type: String, required: true },
  trip: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
});

export default mongoose.model<Accommodation>('Accommodation', accommodationModel);
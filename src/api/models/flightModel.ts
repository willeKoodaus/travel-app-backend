import mongoose from 'mongoose';
import { Flight } from '../../interfaces/Flight';
import { Schema } from 'mongoose';

const flightModel = new mongoose.Schema<Flight>({
  airline: { type: String, required: true },
  flightNumber: { type: String, required: true },
  departure: { type: Date, required: true },
  arrival: { type: Date, required: true },
  departureAirport: { type: String, required: true },
  arrivalAirport: { type: String, required: true },
  trip: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
});

export default mongoose.model<Flight>('Flight', flightModel);
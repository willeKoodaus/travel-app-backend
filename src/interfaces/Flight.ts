import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { Trip } from './Trip';

interface Flight extends Document {
    airline: string;
    flightNumber: string;
    departure: Date;
    arrival: Date;
    departureAirport: string;
    arrivalAirport: string;
    trip: Types.ObjectId | Trip;
  }

export {Flight};
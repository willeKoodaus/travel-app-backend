import {Types, Document} from 'mongoose';
import {Trip} from './Trip';

interface Accommodation extends Document{
    name: string;
    address: string;
    checkInDate: Date;
    checkOutDate: Date;
    bookingConfirmationNumber: string;
    trip: Types.ObjectId | Trip;
  }

export {Accommodation};
import {User} from './User';
import {Types, Document} from 'mongoose';
import {Flight} from './Flight';
import {Accommodation} from './Accommodation';
import {Activity} from './Activity';

// Trip interface
interface Trip extends Document {
  user: Types.ObjectId | User;
  flight: Types.ObjectId | Flight;
  accommodation: Types.ObjectId | Accommodation;
  startDate: Date;
  endDate: Date;
  activityList: (Types.ObjectId | Activity)[];
  packingList: string[];
  destination: string;
}

interface TripTest {
  id?: string;
  user?: Types.ObjectId | User;
  flight?: Types.ObjectId | Flight;
  accommodation?: Types.ObjectId | Accommodation;
  startDate?: Date;
  endDate?: Date;
  activityList?: (Types.ObjectId | Activity)[];
  packingList?: string[];
  destination?: string;
}

export {Trip, TripTest};

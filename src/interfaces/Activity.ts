import {Types, Document} from 'mongoose';
import {Trip} from './Trip';

// Activity interface
interface Activity extends Document {
    name: string;
    date: Date;
    location: string;
    description: string;
    trip: Types.ObjectId | Trip;
  }

  export {Activity};    
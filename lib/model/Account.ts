import mongoose, { Schema, models } from 'mongoose';
import { string } from 'zod';

const AccountSchema = new Schema(
  {
    plaidId: {
      type: String,
    },

    name: {
      type: String,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, collection: 'Account' }
);

const Account = models.Account || mongoose.model('Account', AccountSchema);

export default Account;

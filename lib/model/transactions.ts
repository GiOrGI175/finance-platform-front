import mongoose, { Schema, models } from 'mongoose';

const TransactionsSchema = new Schema(
  {
    amount: {
      type: String,
      required: [true, 'Amount is required'],
      validate: {
        validator: function (v: string) {
          return /^-?\d+(\.\d{1,2})?$/.test(v);
        },
        message: 'Amount must be a valid number',
      },
    },
    payee: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Categories',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, collection: 'Transactions' }
);

const Transactions =
  models.Transactions || mongoose.model('Transactions', TransactionsSchema);

export default Transactions;

import mongoose, { Schema, models } from 'mongoose';

const TransactionsSchema = new Schema(
  {
    amount: {
      type: String,
    },
    payee: {
      type: String,
    },
    notes: {
      type: String,
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
  },
  { timestamps: true, collection: 'Transactions' }
);

const Transactions =
  models.Transactions || mongoose.model('Transactions', TransactionsSchema);

export default Transactions;

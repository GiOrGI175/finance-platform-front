import mongoose, { Schema, models } from 'mongoose';

const CategoriesSchema = new Schema(
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
  { timestamps: true, collection: 'Categories' }
);

const Categories =
  models.Categories || mongoose.model('Categories', CategoriesSchema);

export default Categories;

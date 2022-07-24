import { Schema, model } from 'mongoose';

const transactionSchema = new Schema({
  blockNumber: { type: String, required: true },
  transactionId: { type: String, required: true },
  senderAddress: { type: String, required: true },
  recipientsAddress: { type: String, required: true },
  blockConfirmations: { type: Number, required: true },
  date: { type: String, required: true },
  importDate: { type: Date, required: true },
  value: { type: Number, required: true },
  transactionFee: { type: Number, required: true },
});

export const transactionModel = model('Transaction', transactionSchema);

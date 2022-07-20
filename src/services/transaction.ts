import { transactionModel } from '../db';
import { Transaction } from '../models';

export const transactionService = {
  getTransactionPagesCount: async (
    blockNumber?: string,
    transactionId?: String,
    senderAddress?: String,
    recipientsAddress?: String
  ) => {
    if (transactionId) {
      const transactionsCount = await transactionModel.countDocuments({  transactionId: { $regex: transactionId }, });
      return Math.ceil(transactionsCount / 14);
    }

    if (blockNumber) {
      const transactionsCount = await transactionModel.countDocuments({ blockNumber: { $regex: blockNumber }, });
      return Math.ceil(transactionsCount / 14);
    }

    if (senderAddress) {
      const transactionsCount = await transactionModel.countDocuments({ senderAddress: { $regex: senderAddress }, });
      return Math.ceil(transactionsCount / 14);
    }

    if (recipientsAddress) {
      const transactionsCount = await transactionModel.countDocuments({ recipientsAddress: { $regex: recipientsAddress } });
      return Math.ceil(transactionsCount / 14);
    }

    const transactionsCount = await transactionModel.countDocuments();
    return Math.ceil(transactionsCount / 14);
  },

  getTransactions(
    limit: number = 10,
    skip: number = 0,
    blockNumber?: string,
    transactionId?: string,
    senderAddress?: string,
    recipientsAddress?: string
  ): Promise<Transaction[] | []> {
    if (transactionId) {
      return transactionModel.find({ transactionId: { $regex: transactionId } }).skip(skip).limit(limit);
    }

    if (blockNumber) {
      return transactionModel.find({ blockNumber: { $regex: blockNumber } }).skip(skip).limit(limit);
    }

    if (senderAddress) {
      return transactionModel.find({ senderAddress: { $regex: senderAddress } }).skip(skip).limit(limit);
    }

    if (recipientsAddress) {
      return transactionModel.find({ recipientsAddress: { $regex: recipientsAddress } }).skip(skip).limit(limit);
    }
    
    return transactionModel.find().sort([['date', -1]]).skip(skip).limit(limit);
  },

  createTransaction(transactionsData: Transaction) {
    transactionModel.create(transactionsData)
  },
};

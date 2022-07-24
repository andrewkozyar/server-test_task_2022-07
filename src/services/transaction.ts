import { transactionModel } from '../db';
import { Transaction } from '../models';

export const transactionService = {
  getTransactionsCount: async (
    blockNumber?: string,
    transactionId?: String,
    senderAddress?: String,
    recipientsAddress?: String
  ) => {
    if (transactionId) {
      return await transactionModel.countDocuments({  transactionId: { $regex: transactionId }, });
    }

    if (blockNumber) {
      return await transactionModel.countDocuments({ blockNumber: { $regex: blockNumber }, });
    }

    if (senderAddress) {
      return await transactionModel.countDocuments({ senderAddress: { $regex: senderAddress }, });
    }

    if (recipientsAddress) {
      return await transactionModel.countDocuments({ recipientsAddress: { $regex: recipientsAddress } });
    }

    return await transactionModel.countDocuments();
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
    
    return transactionModel.find().sort([['importDate', -1]]).skip(skip).limit(limit);
  },

  createTransaction(transactionsData: Transaction) {
    transactionModel.create(transactionsData)
  },

  updateTransactionsBlockConfirmations: async (blockNumber: number) => {
    const transactions = await transactionModel.find({});

    const transactionBlocks = transactions.reduce((acc: any, transaction: any) => {
      if (!acc.includes(transaction.blockNumber)) {
        acc.push(transaction.blockNumber);
      }
      return acc;
    }, [])

    for (let block of transactionBlocks) {
      const blockConfirmations = blockNumber - block; 

      await transactionModel.updateMany({ blockNumber: block }, { blockConfirmations });
    }
  },
};

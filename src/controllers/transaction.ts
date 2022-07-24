import { transactionService } from '../services';
import { Request, Response } from 'express';
import { Transaction } from '../models';

export const transactionController = {
  getTransactions: async (req: Request, res: Response) => {
    try {
      const { 
        limit,
        skip,
        transactionId,
        blockNumber,
        senderAddress,
        recipientsAddress
      } = req.query;

      const transactions = await transactionService.getTransactions(
        Number(limit),
        Number(skip),
        blockNumber as string,
        transactionId as string,
        senderAddress as string,
        recipientsAddress as string
      );

      const transactionsCount = await transactionService.getTransactionsCount(
        blockNumber as string,
        transactionId as string,
        senderAddress as string,
        recipientsAddress as string
      );

      res.json({
        transactions,
        transactionPagesCount: Math.ceil(transactionsCount / 14)
      });
    } catch (e: any) {
      res.status(400).json(e.message);
    }
  },
};

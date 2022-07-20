import { Transaction } from "../models";
import { NextFunction, Request, Response } from 'express';

export const transactionMiddleware = {
  validateTransactionDate: async (req: Request, res: Response) => {
    try {
    //   const transactions = req.transactions as Transaction[];
      
    //   res.json(transactions.map(({ date, ...transaction }) => {
    //     return {
    //       date: date.toLocaleString('en-GB', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
    //       ...transaction
    //     }
    //   }));
    } catch (e: any) {
      res.status(400).json(e.message);
    }
  },
};

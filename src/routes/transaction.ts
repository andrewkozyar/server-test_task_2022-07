import express from 'express';
import { transactionController } from '../controllers';

export const transactionRouter = express.Router();

transactionRouter.get('/', transactionController.getTransactions);


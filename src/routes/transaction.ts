import express from 'express';
import { transactionController } from '../controllers';
import { getTransactionDataFromEtherscan } from '../etherscan';
import { transactionMiddleware } from '../middlewares';

export const transactionRouter = express.Router();

transactionRouter.get('/', transactionController.getTransactions);

transactionRouter.post('/', () => getTransactionDataFromEtherscan());


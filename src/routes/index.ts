import express from 'express'
import { transactionRouter } from './transaction';

export const router = express.Router();

router.use('/transactions', transactionRouter);

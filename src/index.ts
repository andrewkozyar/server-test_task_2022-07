import express from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import mongoose from 'mongoose';
import cors from 'cors';

import { router } from './routes';
import { getTransactionsFromEtherscan } from './etherscan';

const app = express();

_connectionDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', router);

getTransactionsFromEtherscan()

const port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`Server ready on ${port}`);
});

function _connectionDB() {
  mongoose.connect('mongodb://localhost/test_task_2022-07', { useUnifiedTopology: true, useNewUrlParser: true });

  const { connection } = mongoose;

  connection.on('error', (error) => {
    console.log(error);
  });
};

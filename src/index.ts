import express from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import mongoose from 'mongoose';
import cors from 'cors';

import { router } from './routes';

const app = express();

_connectionDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', router);

app.listen(5000, () => {
  console.log('Server ready on 5000');
});

function _connectionDB() {
  mongoose.connect('mongodb://localhost/test_task_2022-07', { useUnifiedTopology: true, useNewUrlParser: true });

  const { connection } = mongoose;

  connection.on('error', (error) => {
    console.log(error);
  });
};

export interface Transaction {
  _id?: string;
  blockNumber: string;
  transactionId: string;
  senderAddress: string
  recipientsAddress: string;
  blockInformation: number;
  date: Date;
  value:  number;
  transactionFee: number;
}

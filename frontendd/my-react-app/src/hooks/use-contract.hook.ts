import { useState, useEffect } from 'react';

const useGuessGame = () => {
  const [isPending, setIsPending] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState('');

  const submitPredictions = async (predictions) => {
    setIsPending(true);
    try {
      // Simulate a transaction with a smart contract
      // Replace this with actual contract interaction logic
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setTransactionStatus('success');
    } catch (error) {
      setTransactionStatus('error');
    } finally {
      setIsPending(false);
    }
  };

  return { submitPredictions, isPending, transactionStatus };
};

export { useGuessGame };
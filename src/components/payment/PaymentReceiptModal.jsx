
import React, { useEffect, useState } from 'react';
import { useAuctionContext } from '../../hooks/auction/useAuctionContext';
import '../../styles/PaymentReceiptModal.css'; 

const PaymentReceiptModal = ({ auction, onClose }) => {
  const { getTransactionForAuction, loading } = useAuctionContext();
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (auction) {
      setError('');
      setTransaction(null);
      getTransactionForAuction(auction.id)
        .then(setTransaction)
        .catch(err => setError('Failed to load transaction details.'));
    }
  }, [auction, getTransactionForAuction]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content receipt-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Payment Receipt</h2>
        
        {loading && <div className="loading">Loading receipt...</div>}
        {error && <div className="error-message">{error}</div>}
        
        {transaction && (
          <div className="receipt-details">
            <div className="receipt-item">
              <strong>Transaction ID:</strong>
              <span>{transaction.id}</span>
            </div>
            <div className="receipt-item">
              <strong>Auction ID:</strong>
              <span>{transaction.auctionId}</span>
            </div>
            <div className="receipt-item">
              <strong>Item:</strong>
              <span>{auction.productName}</span>
            </div>
            <div className="receipt-item">
              <strong>Seller:</strong>
              <span>{transaction.sellerUsername}</span>
            </div>
            <div className="receipt-item">
              <strong>Buyer:</strong>
              <span>{transaction.buyerUsername}</span>
            </div>
            <div className="receipt-item">
              <strong>Date Paid:</strong>
              <span>{new Date(transaction.timestamp).toLocaleString()}</span>
            </div>
            <div className="receipt-item">
              <strong>Payment Method:</strong>
              <span>{transaction.paymentMethod}</span>
            </div>
            <div className="receipt-item final-amount">
              <strong>Amount Paid:</strong>
              <span>${transaction.amount.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentReceiptModal;
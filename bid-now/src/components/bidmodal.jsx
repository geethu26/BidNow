import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const BidModal = ({ show, onClose, auction, onBidSuccess }) => {
  const [amount, setAmount] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    if (auction) {
      const defaultBid = auction.currentBid + 50;
      setAmount(defaultBid);
      setValidationMessage("");
    }
  }, [auction]);

  const handleSubmit = () => {
    const bidValue = parseFloat(amount);
    const minBid = auction.currentBid + 50;
    if (isNaN(bidValue) || bidValue < minBid) {
      setValidationMessage(`Minimum bid is $${minBid}`);
      return;
    }

    setValidationMessage("");
    onBidSuccess(bidValue);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Place Bid on "{auction?.title}"</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Bid Amount</Form.Label>
          <Form.Control
            type="number"
            value={amount}
            min={auction?.currentBid + 50}
            step="10"
            onChange={(e) => setAmount(e.target.value)}
            isInvalid={!!validationMessage}
          />
          {validationMessage && (
            <Form.Text className="text-danger">{validationMessage}</Form.Text>
          )}
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Place Bid
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BidModal;

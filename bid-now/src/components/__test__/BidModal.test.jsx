import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BidModal from "../bidmodal";

describe("BidModal", () => {
  const auction = {
    id: 2,
    title: "Antique Vase",
    currentBid: 200,
  };

  const setup = (props = {}) => {
    const defaultProps = {
      show: true,
      onClose: jest.fn(),
      onBidSuccess: jest.fn(),
      auction,
    };
    return render(<BidModal {...defaultProps} {...props} />);
  };

  test("renders with default bid amount", () => {
    setup();
    expect(
      screen.getByText(/place bid on "Antique Vase"/i)
    ).toBeInTheDocument();
    const input = screen.getByRole("spinbutton");
    expect(input.value).toBe("250");
  });

  test("calls onBidSuccess with valid amount", () => {
    const onBidSuccess = jest.fn();
    const onClose = jest.fn();
    setup({ onBidSuccess, onClose });

    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "300" },
    });
    fireEvent.click(screen.getByRole("button", { name: /place bid/i }));

    expect(onBidSuccess).toHaveBeenCalledWith(300);
    expect(onClose).toHaveBeenCalled();
  });

  test("alerts if bid is too low", () => {
    window.alert = jest.fn();
    setup();

    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "210" },
    });
    fireEvent.click(screen.getByRole("button", { name: /place bid/i }));

    expect(window.alert).toHaveBeenCalledWith("Minimum bid is $250");
  });
});

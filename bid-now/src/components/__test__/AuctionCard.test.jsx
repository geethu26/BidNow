import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AuctionCard from "../auctioncard";

describe("AuctionCard", () => {
  const auction = {
    id: 1,
    title: "Vintage Watch",
    category: "Accessories",
    currentBid: 500,
    bids: 10,
    image: "https://example.com/watch.jpg",
    endTime: new Date(Date.now() + 3600000), // 1 hour from now
  };

  test("renders auction details correctly", () => {
    render(
      <AuctionCard
        auction={auction}
        countdown="01:00:00"
        onPlaceBid={() => {}}
      />
    );

    expect(screen.getByText("Vintage Watch")).toBeInTheDocument();
    expect(screen.getByText("Accessories")).toBeInTheDocument();
    expect(screen.getByText("$500")).toBeInTheDocument();
    expect(screen.getByText("01:00:00")).toBeInTheDocument();
  });

  test("calls onPlaceBid when button clicked", () => {
    const onPlaceBid = jest.fn();
    render(
      <AuctionCard
        auction={auction}
        countdown="01:00:00"
        onPlaceBid={onPlaceBid}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /place bid/i }));
    expect(onPlaceBid).toHaveBeenCalledWith(auction);
  });

  test("disables Place Bid button when auction has ended", () => {
    const endedAuction = { ...auction, endTime: new Date(Date.now() - 10000) };
    render(
      <AuctionCard
        auction={endedAuction}
        countdown="ENDED"
        onPlaceBid={() => {}}
      />
    );
    const bidButton = screen.getByRole("button", { name: /auction ended/i });
    expect(bidButton).toBeDisabled();
  });
});

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function AuctionDetail({ auctionId }) {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    socket.emit("joinAuction", auctionId);

    socket.on("bidUpdate", (data) => {
      setBids((prev) => [...prev, data]);
    });

    return () => {
      socket.off("bidUpdate");
    };
  }, [auctionId]);

  return (
    <div>
      <h2>Auction {auctionId}</h2>
      <ul>
        {bids.map((b, i) => (
          <li key={i}>{b.user}: {b.amount}</li>
        ))}
      </ul>
    </div>
  );
}

export default AuctionDetail;

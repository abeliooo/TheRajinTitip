import { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";

function AuctionDetail({ auctionId }) {
  const [bids, setBids] = useState([]);
  const [socket, setSocket] = useState(null);

  const userInfo = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('userInfo'));
    } catch (e) {
      return null;
    }
  }, []);

  useEffect(() => {
    let newSocket = null;

    if (auctionId && userInfo) {
      newSocket = io(process.env.REACT_APP_SOCKET_URL, {
        auth: {
          token: userInfo.token
        }
      });
      setSocket(newSocket);

    newSocket.emit("joinAuction", auctionId);

      newSocket.on("bidUpdate", (data) => {
        setBids((prev) => [...prev, data]);
      });
    }

    return () => {
      newSocket?.off("bidUpdate");
      newSocket?.disconnect();
    };
  }, [auctionId, userInfo]);

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

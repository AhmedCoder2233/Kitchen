"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type KitchenOrder = {
  orderid: string;
  item_name: string;
  item_description: string;
  item_quantity: number;
};

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔄 Fetch kitchen orders
  const fetchOrders = async () => {
    try {
      const res = await fetch("https://jessika-patrological-crankly.ngrok-free.dev/users/kitchenorder");
      if (!res.ok) return;
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Mark order done
  const markOrderDone = async (orderid: string) => {
    try {
      // PUT to mark as done
      await fetch(`https://jessika-patrological-crankly.ngrok-free.dev/users/kitchen/order/${orderid}/done`, {
        method: "PUT",
      });

      // DELETE the order
      await fetch(`https://jessika-patrological-crankly.ngrok-free.dev/users/delete/kitchen/order/${orderid}`, {
        method: "DELETE",
      });

      // Update UI instantly
      setOrders((prev) => prev.filter((o) => o.orderid !== orderid));
    } catch (err) {
      console.error(err);
    }
  };

  // 🔄 Interval to fetch every 10s
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // 🔑 Simple password check
  const handleLogin = () => {
    if (password === "12345") setIsAuthenticated(true);
    else alert("Wrong Password");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <h1 className="text-4xl font-bold text-orange-500 mb-6">Kitchen Login</h1>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 border rounded-lg mb-4 w-64 text-center focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <button
          onClick={handleLogin}
          className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <h1 className="text-3xl font-bold text-orange-500 mb-6 text-center">
        Kitchen Dashboard
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-600 text-center">No active orders.</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order.orderid}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm hover:shadow-md transition bg-orange-50"
            >
              <div className="flex-1">
                <p className="font-bold text-lg text-orange-700">{order.item_name}</p>
                <p className="text-sm text-orange-600">{order.item_description}</p>
                <p className="text-sm text-orange-600">Quantity: {order.item_quantity}</p>
                <p className="text-sm text-orange-600">{order.table_no}</p>
              </div>

              <button
                onClick={() => markOrderDone(order.orderid)}
                className="mt-3 sm:mt-0 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                Order Done
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

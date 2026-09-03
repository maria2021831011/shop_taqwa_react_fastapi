import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const SalesGraph = () => {
  const [data, setData] = useState([]);

  const fetchSales = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8000/owner/sales-analytics", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div>
      <h2>Sales Analytics</h2>

      <div className="card" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesGraph;


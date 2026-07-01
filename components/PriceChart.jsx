"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getPriceHistory } from "@/app/action";
import { Loader2 } from "lucide-react";

export default function PriceChart({ productId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const history = await getPriceHistory(productId);

        if (!history || history.length === 0) {
          if (isMounted) { setData([]); setLoading(false); }
          return;
        }

        const formattedData = history.map((item) => {
          const dateObj = new Date(item.checked_at);
          
          // Format Date: e.g., "Oct 24"
          const dateStr = dateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          // Format Time: e.g., "14:30" (or use hour12: true for "2:30 PM")
          const timeStr = dateObj.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, 
          });
          
          const locationLabel = item.location_name || item.location || "Store"; 

          return {
            timestamp: dateObj.getTime(),
            // Unique X-Axis label containing Date + Time + Location
            displayLabel: `${dateStr} ${timeStr} (${locationLabel})`,
            date: dateStr,
            time: timeStr,
            location: locationLabel,
            price: parseFloat(item.price) || 0,
          };
        });

        // Sort chronologically so the timeline draws correctly from left to right
        const sortedData = formattedData.sort((a, b) => a.timestamp - b.timestamp);

        if (isMounted) {
          setData(sortedData);
        }
      } catch (error) {
        console.error("Failed to load price history:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-500 w-full">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading chart...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 w-full border border-dashed border-gray-200 rounded-lg bg-gray-50/50">
        No price history yet.
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <h4 className="text-sm font-semibold mb-4 text-gray-700">
        Price History over Time
      </h4>
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="displayLabel" 
              tick={{ fontSize: 10 }} 
              stroke="#9ca3af"
              tickLine={false}
              axisLine={false}
              dy={10}
              // Optional: If labels clutter together, let Recharts skip overlapping items automatically:
              interval="preserveStartEnd" 
            />
            <YAxis 
              tick={{ fontSize: 11 }} 
              stroke="#9ca3af"
              tickLine={false}
              axisLine={false}
              dx={-5}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  return (
                    <div className="bg-white border border-gray-200 p-2 rounded-md shadow-md text-xs">
                      <p className="font-semibold text-gray-500">
                        {dataPoint.date} @ {dataPoint.time}
                      </p>
                      
                      <p className="font-semibold text-[#FA5D19] text-sm">
                        {dataPoint.price.toFixed(2)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#FA5D19"
              strokeWidth={2}
              dot={{ fill: "#FA5D19", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
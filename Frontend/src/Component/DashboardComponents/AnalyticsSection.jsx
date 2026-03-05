import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

import { fetchExpenseByCategory } from "../../redux/Features/transactionSlice";

const COLORS = ["#22c55e", "#ef4444"];


// 🔹 Custom label renderer for donut chart
const renderCashFlowLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name
}) => {
  const RADIAN = Math.PI / 180;

  const radius = outerRadius + 25;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const color = name === "Income" ? "#22c55e" : "#ef4444";

  return (
    <g>
      {/* Text label */}
      <text
        x={x}
        y={y}
        fill={color}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{ fontSize: 14, fontWeight: 600 }}
      >
        {name} {(percent * 100).toFixed(1)}%
      </text>

      {/* Connector line */}
      <line
        x1={cx + outerRadius * Math.cos(-midAngle * RADIAN)}
        y1={cy + outerRadius * Math.sin(-midAngle * RADIAN)}
        x2={x}
        y2={y}
        stroke={color}
        strokeWidth={2}
      />
    </g>
  );
};


function AnalyticsSection() {
  const dispatch = useDispatch();

  const { income, expense, expenseChartData } = useSelector(
    (state) => state.transaction
  );

  const { startDate, endDate } = useSelector((state) => state.date);

  const userId = JSON.parse(localStorage.getItem("userInfo"))?._id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchExpenseByCategory({ userId, startDate, endDate }));
    }
  }, [dispatch, userId, startDate, endDate]);

  const incomeExpenseData = [
    { name: "Income", value: income || 0 },
    { name: "Expense", value: expense || 0 }
  ];

  return (
    <div style={{ marginTop: 30 }}>
      <h2 style={{ fontWeight: 800, marginBottom: 30 }}>Analytics</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 2fr",
          gap: "30px"
        }}
      >

        {/* CASH FLOW DONUT */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: 25,
            border: "1px solid #e5e7eb"
          }}
        >
          <h4 style={{ marginBottom: 20 }}>Cash Flow</h4>

          <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
              <PieChart>

                <Pie
                  data={incomeExpenseData}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                  labelLine={false}
                  label={renderCashFlowLabel}
                >
                  {incomeExpenseData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => `$${value.toLocaleString()}`}
                />

              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>



        {/* BAR CHART */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: 25,
            border: "1px solid #e5e7eb"
          }}
        >
          <h4 style={{ marginBottom: 20 }}>Top Expenses by Category</h4>

          <div style={{ width: "100%", height: 400 }}>
            {expenseChartData?.length > 0 ? (
              <ResponsiveContainer>
                <BarChart
                  data={expenseChartData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="#e5e7eb"
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                    height={70}
                    tickMargin={20}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />

                  <Tooltip
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />

                  <Bar
                    dataKey="amount"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                    barSize={45}
                  />

                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#888"
                }}
              >
                No expense data available
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default AnalyticsSection;
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

// Imported MUI components and useTheme hook to access the current theme colors
import { Box, Paper, Typography, useTheme } from "@mui/material";

import { fetchExpenseByCategory } from "../../redux/Features/transactionSlice";

function AnalyticsSection() {
  const dispatch = useDispatch();
  
  // Access the active theme (light or dark)
  const theme = useTheme();

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

  // Defined theme-aware colors for the pie chart using your success and error palette
  const pieColors = [theme.palette.success.main, theme.palette.error.main];

  // Custom label renderer for donut chart moved inside the component to access theme colors
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

    // Apply specific theme color based on income or expense
    const color = name === "Income" ? theme.palette.success.main : theme.palette.error.main;

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

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 4, color: "text.primary" }}>
        Analytics
      </Typography>

      <Box
        sx={{
          display: "grid",
          // Made the grid responsive: stack on mobile, side-by-side on desktop
          gridTemplateColumns: { xs: "1fr", md: "1.2fr 2fr" },
          gap: 4
        }}
      >

        {/* CASH FLOW DONUT */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderRadius: 3,
            p: 3,
            border: "1px solid",
            borderColor: "divider"
          }}
        >
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: "text.primary" }}>
            Cash Flow
          </Typography>

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
                    <Cell key={index} fill={pieColors[index]} />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => `$${value.toLocaleString()}`}
                  // Theme-aware tooltip styling
                  contentStyle={{ 
                    backgroundColor: theme.palette.background.paper,
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.primary,
                    borderRadius: '8px'
                  }}
                  itemStyle={{ color: theme.palette.text.primary }}
                />

              </PieChart>
            </ResponsiveContainer>
          </div>

        </Paper>



        {/* BAR CHART */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderRadius: 3,
            p: 3,
            border: "1px solid",
            borderColor: "divider"
          }}
        >
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: "text.primary" }}>
            Top Expenses by Category
          </Typography>

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
                    stroke={theme.palette.divider} // Theme-aware grid lines
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
                    tick={{ fill: theme.palette.text.secondary }} // Theme-aware axis text
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fill: theme.palette.text.secondary }} // Theme-aware axis text
                  />

                  <Tooltip
                    formatter={(value) => `$${value.toLocaleString()}`}
                    // Theme-aware tooltip styling
                    contentStyle={{ 
                      backgroundColor: theme.palette.background.paper,
                      borderColor: theme.palette.divider,
                      color: theme.palette.text.primary,
                      borderRadius: '8px'
                    }}
                    cursor={{ fill: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
                  />

                  <Bar
                    dataKey="amount"
                    fill={theme.palette.primary.main} // Theme-aware bar color
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
                  color: theme.palette.text.secondary // Theme-aware fallback text
                }}
              >
                No expense data available
              </div>
            )}
          </div>

        </Paper>
      </Box>
    </Box>
  );
}

export default AnalyticsSection;
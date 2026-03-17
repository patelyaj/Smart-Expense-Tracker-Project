import React from "react";
import { useSelector } from "react-redux";
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

import { Box, Paper, Typography, useTheme, CircularProgress } from "@mui/material";

function AnalyticsSection() {
  const theme = useTheme();

  // Extract status for loading states
  const { income, expense, expenseChartData, status } = useSelector(
    (state) => state.transaction
  );

  const incomeExpenseData = [
    { name: "Income", value: income || 0 },
    { name: "Expense", value: expense || 0 }
  ];

  const pieColors = [theme.palette.success.main, theme.palette.error.main];

  const renderCashFlowLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const color = name === "Income" ? theme.palette.success.main : theme.palette.error.main;

    return (
      <g>
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
            {status === "loading" ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <CircularProgress />
              </Box>
            ) : (
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
                    formatter={(value) => `\u20B9${value.toLocaleString()}`}
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
            )}
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
            {status === "loading" ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <CircularProgress />
              </Box>
            ) : expenseChartData?.length > 0 ? (
              <ResponsiveContainer>
                <BarChart
                  data={expenseChartData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke={theme.palette.divider} 
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
                    tick={{ fill: theme.palette.text.secondary }} 
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `\u20B9${value}`}
                    tick={{ fill: theme.palette.text.secondary }} 
                  />

                  <Tooltip
                    formatter={(value) => `\u20B9${value.toLocaleString()}`}
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
                    fill={theme.palette.primary.main} 
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
                  color: theme.palette.text.secondary 
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
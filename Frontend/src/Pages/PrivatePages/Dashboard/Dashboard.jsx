import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Popover } from '@mui/material';
import { alpha } from '@mui/material/styles';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; // <-- Added Down Arrow
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

// Import your components
import Navbar from '../../../Component/DashboardComponents/Navbar';
import FinancialSummary from '../../../Component/DashboardComponents/FinancialSummary';
import AnalyticsSection from '../../../Component/DashboardComponents/AnalyticsSection';
import DashboardDatePicker from '../../../Component/DashboardDatePicker';
import { setDateRange } from '../../../redux/Features/dateSlice';
import { fetchDashboardSummary,markDashboardStale } from '../../../redux/Features/transactionSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { startDate, endDate } = useSelector((state) => state.date);
  const { isDashboardStale } = useSelector((state) => state.transaction); // Get the flag
  const [anchorEl, setAnchorEl] = useState(null);
  const openDatePopover = Boolean(anchorEl);

  const userId = JSON.parse(localStorage.getItem("userInfo"))?._id;

  // ONE SINGLE FETCH FOR THE WHOLE DASHBOARD
  useEffect(() => {
    if (userId && startDate && endDate && isDashboardStale) {
      dispatch(fetchDashboardSummary({ startDate, endDate }));
    }
  }, [dispatch, userId, startDate, endDate,isDashboardStale]);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
      <Navbar />

      <Container maxWidth={false} sx={{ mt: 4 }}>        

        {/* TOP HEADER: Title Left, Date Dropdown Right */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          
          <Typography variant="h5" fontWeight={800} color="text.primary">
            Dashboard
          </Typography>

          {/* Clean, Professional SaaS-style Date Button */}
          <Button
            variant="outlined"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            endIcon={<CalendarMonthIcon fontSize="small" />}
            // endIcon={<KeyboardArrowDownIcon />}
            sx={{
              borderColor: 'divider',
              color: 'text.primary',
              bgcolor: 'background.paper',
              textTransform: 'none',
              fontWeight: 600,
              px: 2,
              py: 0.8,
              mr : 6,
              gap: 8,
              borderRadius: 2,
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.text.primary, 0.04),
                borderColor: 'text.secondary',
              }
            }}
          >
            {dayjs(startDate).format("MMM D, YYYY")} - {dayjs(endDate).format("MMM D, YYYY")}
          </Button>

          <Popover
            open={openDatePopover}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{ paper: { sx: { mt: 1, borderRadius: 2, boxShadow: 4 } } }}
          >
            <DashboardDatePicker 
              initialStartDate={startDate}
              initialEndDate={endDate}
              onApply={(newStart, newEnd) => {
                dispatch(setDateRange({ startDate: newStart, endDate: newEnd }));
                dispatch(markDashboardStale());
              }}
              onClose={() => setAnchorEl(null)} 
            />
          </Popover>

        </Box>

        {/* EXACT POSITIONING: Income -> Balance -> Expense */}
        <FinancialSummary />

        {/* Analytics Section */}
        <AnalyticsSection />

      </Container>
    </Box>
  );
};

export default Dashboard;
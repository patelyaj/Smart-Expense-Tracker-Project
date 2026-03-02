import * as React from "react";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useDispatch, useSelector } from "react-redux";
import { setDateRange } from "../redux/Features/dateSlice";

export default function DashboardDatePicker({ onClose }) {
  const dispatch = useDispatch();
  const { startDate, endDate } = useSelector((state) => state.date);

  const handlePreset = (type) => {
    let newStart, newEnd;

    switch (type) {
      case "thisWeek":
        newStart = dayjs().startOf("week");
        newEnd = dayjs().endOf("week");
        break;
      case "lastWeek":
        newStart = dayjs().subtract(1, "week").startOf("week");
        newEnd = dayjs().subtract(1, "week").endOf("week");
        break;
      case "last7":
        newStart = dayjs().subtract(6, "day");
        newEnd = dayjs();
        break;
      case "currentMonth":
        newStart = dayjs().startOf("month");
        newEnd = dayjs().endOf("month");
        break;
      default:
        return;
    }

    dispatch(setDateRange({
      startDate: newStart.toISOString(),
      endDate: newEnd.toISOString()
    }));
  };

  return (
    <Box sx={{ p: 3, width: 500 }}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={2}>
          <DatePicker
            label="Start Date"
            value={dayjs(startDate)}
            onChange={(newDate) =>
              dispatch(setDateRange({
                startDate: newDate.toISOString(),
                endDate
              }))
            }
          />

          <DatePicker
            label="End Date"
            value={dayjs(endDate)}
            onChange={(newDate) =>
              dispatch(setDateRange({
                startDate,
                endDate: newDate.toISOString()
              }))
            }
          />
        </Stack>

        <Stack spacing={1} sx={{ minWidth: 150 }}>
          <Typography fontWeight={600}>
            Quick Select
          </Typography>

          <Button onClick={() => handlePreset("thisWeek")}>
            This Week
          </Button>
          <Button onClick={() => handlePreset("lastWeek")}>
            Last Week
          </Button>
          <Button onClick={() => handlePreset("last7")}>
            Last 7 Days
          </Button>
          <Button onClick={() => handlePreset("currentMonth")}>
            Current Month
          </Button>

          <Divider sx={{ my: 1 }} />

         
        </Stack>
      </Stack>
    </Box>
  );
}
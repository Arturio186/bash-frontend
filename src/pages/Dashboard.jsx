import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores";
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  Modal,
  IconButton,
  Divider
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const Dashboard = observer(() => {
  const { userStore } = useStore();

  const [hours] = useState({
    start: "10:00",
    end: "22:00"
  });
  const [now] = useState(new Date());

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("needRefresh", () => {
      console.log("Надо подгрузить заявки");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [records, setRecords] = useState([
    {
      id: 1,
      username: "@crazysiberian86",
      date: new Date(),
      time: "11:15",
      amount: 100,
      type: 1,
      address: "0x123abc123abc123abc123abc123abc123abc123abc123abc"
    },
    {
      id: 2,
      username: "Ольга",
      date: new Date(),
      time: "14:45",
      amount: 250,
      type: 2,
      address: "0x456...def"
    }
  ]);

  const generateTimeSlots = () => {
    const slots = [];
    const [startHour] = hours.start.split(":").map(Number);
    const [endHour] = hours.end.split(":").map(Number);

    for (let h = startHour; h <= endHour; h++) {
      const intervals = [];
      for (let m = 0; m < 60; m += 15) {
        const timeLabel = `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}`;

        const record = records.find(
          (r) =>
            r.time === timeLabel &&
            r.date.toDateString() === currentDate.toDateString()
        );

        const isNow =
          currentDate.toDateString() === now.toDateString() &&
          now.getHours() === h &&
          Math.floor(now.getMinutes() / 15) * 15 === m;

        intervals.push(
          <Paper
            key={timeLabel}
            onClick={() => record && setSelectedRecord(record)}
            sx={{
              p: 6,
              mb: 1,
              height: "20vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: record ? "#bbdefb" : "white",
              border: isNow ? "2px solid #f44336" : "1px solid #e0e0e0",
              borderRadius: 0,
              cursor: record ? "pointer" : "default",
              transition: "0.2s",
              '&:hover': {
                backgroundColor: record ? "#90caf9" : "#f5f5f5"
              }
            }}
          >
            <Typography variant="caption" color="textSecondary">
              {timeLabel}
            </Typography>
            {record && (
              <Typography variant="body2" fontWeight={600}>
                {record.username}
              </Typography>
            )}
          </Paper>
        );
      }

      slots.push(
        <Grid
          item
          xs
          key={h}
          sx={{
            borderLeft: "1px solid #e0e0e0",
            height: "100%",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Box
            sx={{
              py: 1,
              backgroundColor: "#f9f9f9",
              borderBottom: "1px solid #e0e0e0"
            }}
          >
            <Typography align="center" variant="subtitle2" fontWeight={600}>
              {h}:00
            </Typography>
          </Box>
          <Box flex={1}>{intervals}</Box>
        </Grid>
      );
    }
    return slots;
  };

  const handleDeleteRecord = (id) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setSelectedRecord(null);
  };

  const handlePrevDay = () => {
    setCurrentDate((prev) => new Date(prev.getTime() - 86400000));
  };

  const handleNextDay = () => {
    setCurrentDate((prev) => new Date(prev.getTime() + 86400000));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        sx={{ borderBottom: "1px solid #e0e0e0", backgroundColor: "white", boxShadow: 1 }}
      >
        <Box flex={1} />
        <Box display="flex" alignItems="center" justifyContent="center" flex={1}>
          <IconButton onClick={handlePrevDay}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ mx: 2 }} fontWeight={600}>
            {currentDate.toLocaleDateString("ru-RU", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </Typography>
          <IconButton onClick={handleNextDay}>
            <ArrowForward />
          </IconButton>
        </Box>
        <Box flex={1} display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={() => userStore.setIsAuth(false)}>
            Выйти
          </Button>
        </Box>
      </Box>

      {/* Calendar body */}
      <Box flex={1} sx={{ overflowY: "auto", backgroundColor: "#fafafa" }}>
        <Grid container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {generateTimeSlots()}
        </Grid>
      </Box>

      {/* Modal */}
      <Modal open={!!selectedRecord} onClose={() => setSelectedRecord(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: 'none',
            p: 4,
            borderRadius: 2
          }}
        >
          {selectedRecord && (
            <>
              <Typography variant="h6" gutterBottom>
                Запись
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography>Имя: {selectedRecord.username}</Typography>
              <Typography>Дата: {selectedRecord.date.toLocaleDateString()}</Typography>
              <Typography>Время: {selectedRecord.time}</Typography>
              <Typography>Сумма: {selectedRecord.amount}</Typography>
              <Typography>
                Тип: {selectedRecord.type === 1 ? "Продать" : "Купить"}
              </Typography>
              <Typography>Адрес: {selectedRecord.address}</Typography>

              <Button
                sx={{ mt: 3 }}
                variant="contained"
                color="error"
                fullWidth
                onClick={() => handleDeleteRecord(selectedRecord.id)}
              >
                Удалить запись
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
});

export default Dashboard;

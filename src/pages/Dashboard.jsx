import React, { useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores";
import {
  Box,
  Button,
  Typography,
  Grid,
  Modal,
  Paper,
  Divider,
  IconButton
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { socketUrl } from '../consts';

const refreshApplications = async({ hours, setApplications, setHours, currentDate, userStore }) => {
  const [fetchedHours, fetchedApplications] = await userStore.getApplications(currentDate);

  if (!hours.start && fetchedHours.start) {
    setHours(fetchedHours);
  }

  setApplications(fetchedApplications);
};

// Функция для генерации слотов по 15 минут
const generateSlots = (start, end) => {
  const slots = [];
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  let current = new Date();
  current.setHours(startH, startM, 0, 0);

  const endTime = new Date();
  endTime.setHours(endH, endM, 0, 0);

  while (current < endTime) {
    slots.push(new Date(current));
    current = new Date(current.getTime() + 15 * 60 * 1000);
  }

  return slots;
};

// Группировка заявок по времени (15-минутные слоты)
const groupApplicationsBySlot = (applications, slots) => {
  const grouped = slots.map(slot => {
    const slotTime = slot.toTimeString().slice(0, 5); // "HH:MM"
    return {
      slot,
      applications: applications.filter(app => app.time.slice(0, 5) === slotTime)
    };
  });
  return grouped;
};

const chunkSlots = (slots, chunkSize = 4) => {
  const chunks = [];
  for (let i = 0; i < slots.length; i += chunkSize) {
    chunks.push(slots.slice(i, i + chunkSize));
  }
  return chunks;
};


const Dashboard = observer(() => {
  const { userStore } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [hours, setHours] = useState({});
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const socket = io(socketUrl);
    socket.on("needRefresh", () => {
      refreshApplications({ hours, setHours, setApplications, currentDate, userStore });
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    refreshApplications({ hours, setHours, setApplications, currentDate, userStore });
  }, [currentDate]);

  const handlePrevDay = () => setCurrentDate(prev => new Date(prev.getTime() - 86400000));
  const handleNextDay = () => setCurrentDate(prev => new Date(prev.getTime() + 86400000));

  const handleDelete = (id) => {
    (async() => {
      await userStore.deleteApplication(id);
      setSelectedRecord(null)
      await refreshApplications({ hours, setHours, setApplications, currentDate, userStore });
    })();
  }

  const slots = useMemo(() => hours.start && hours.end ? generateSlots(hours.start, hours.end) : [], [hours]);
  const groupedApplications = useMemo(() => groupApplicationsBySlot(applications, slots), [applications, slots]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2} sx={{ borderBottom: "1px solid #e0e0e0", backgroundColor: "white", boxShadow: 1 }}>
        <Box flex={1} />
        <Box display="flex" alignItems="center" justifyContent="center" flex={1}>
          <IconButton onClick={handlePrevDay}><ArrowBack /></IconButton>
          <Typography variant="h6" sx={{ mx: 2 }} fontWeight={600}>
            {currentDate.toLocaleDateString("ru-RU", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </Typography>
          <IconButton onClick={handleNextDay}><ArrowForward /></IconButton>
        </Box>
        <Box flex={1} display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={() => userStore.logout()}>Выйти</Button>
        </Box>
      </Box>

      {/* Schedule */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {chunkSlots(groupedApplications, 4).map((row, rowIndex) => (
          <Box key={rowIndex} sx={{ display: "flex", gap: 1, mb: 1 }}>
            {row.map(({ slot, applications }) => (
              <Paper key={slot.toISOString()} sx={{ flex: 1, p: 1, backgroundColor: applications.length ? '#90EE90' : 'transparent' }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  {slot.toTimeString().slice(0,5)}
                </Typography>
                {applications.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">Свободно</Typography>
                ) : (
                  applications.map(app => (
                    <Paper key={app.id} sx={{ p: 1, mb: 0.5, cursor: "pointer" }} onClick={() => setSelectedRecord(app)}>
                      <Typography variant="body2">
                        <strong>{app.tg_username}</strong> — {app.network} {app.amount} ({app.type === 1 ? "Продажа USDT" : "Покупка USDT"})
                      </Typography>
                    </Paper>
                  ))
                )}
              </Paper>
            ))}
          </Box>
        ))}
      </Box>

      {/* Modal */}
      <Modal open={!!selectedRecord} onClose={() => setSelectedRecord(null)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", borderRadius: 2, p: 4 }}>
          {selectedRecord && (
            <>
              <Typography variant="h5" sx={{ textAlign: 'center' }} gutterBottom>Запись | {selectedRecord.type === 1 ? "Продажа" : "Покупка"}</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography>Оператор: {selectedRecord.operator_username}</Typography>
              <Typography>Клиент: @{selectedRecord.tg_username}</Typography>
              <Typography>Дата: {new Date(selectedRecord.date).toLocaleDateString()} {selectedRecord.time}</Typography>
              <Typography>Сумма: {selectedRecord.amount} {selectedRecord.type === 1 ? "USDT" : "RUB"}</Typography>
              <Typography>Сеть: {selectedRecord.network}</Typography>
              <Typography>Адрес: {selectedRecord.address}</Typography>

              <Button sx={{ mt: 3 }} variant="contained" color="error" fullWidth onClick={() => handleDelete(selectedRecord.id)}>
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

import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import {NavLink} from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper
} from "@mui/material";

import { useStore } from "../stores";
import { paths } from '../consts';

const Login = observer(() => {
  const {userStore} = useStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    userStore.login({username, password});
  };

  return (
    <Container maxWidth="xs">
      <Paper
        elevation={6}
        sx={{ p: 4, mt: 8, borderRadius: 3, textAlign: "center" }}
      >
        <Typography variant="h5" gutterBottom>
          Вход
        </Typography>

        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            fullWidth
            label="Логин"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3, borderRadius: 2 }}
            onClick={handleLogin}
          >
            Войти
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3 }}>
          Нет аккаунта?{" "}
          <NavLink to={paths.REGISTER}>
            Зарегистрируйтесь
          </NavLink>
        </Typography>
      </Paper>
    </Container>
  );
});

export default Login;

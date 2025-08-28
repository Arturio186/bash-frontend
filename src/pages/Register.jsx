import React, { useState } from "react";
import { NavLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper
} from "@mui/material";
import {paths} from '../consts';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const handleRegister = () => {
    console.log("Регистрация:", { email, password, repeatPassword });
  };

  return (
    <Container maxWidth="xs">
      <Paper
        elevation={6}
        sx={{ p: 4, mt: 8, borderRadius: 3, textAlign: "center" }}
      >
        <Typography variant="h5" gutterBottom>
          Регистрация
        </Typography>

        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Повторите пароль"
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3, borderRadius: 2 }}
            onClick={handleRegister}
          >
            Зарегистрироваться
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3 }}>
          Уже есть аккаунт?{" "}
          <NavLink to={paths.LOGIN}>
            Войти
          </NavLink>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;

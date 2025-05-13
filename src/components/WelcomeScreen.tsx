import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import logo from '../assets/logo.png';
import { useTheme } from '../contexts/ThemeContext';
import Highlight from './Highlight';
import { motion } from 'framer-motion';

const WelcomeScreen = ({ onAddTodo }: { onAddTodo: () => void }) => {
  const { getGradientBackground, getTitleColor, getPrimaryColor, getSecondaryColor, timeOffset, setTimeOffset } = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        padding: 2,
        background: getGradientBackground(),
        transition: 'background 3s ease',
        color: getPrimaryColor(),
      }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0 }}
        sx={{
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <motion.img
          src={logo}
          alt="App Logo"
          style={{ width: '150px', marginBottom: '20px', cursor: 'pointer' }}
          onClick={() => setTimeOffset(timeOffset + 1)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        <Typography
          component={motion.h4}
          variant="h4"
          gutterBottom
          sx={{ color: getTitleColor() }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Welcome to Todai!
        </Typography>
        <Typography
          component={motion.p}
          variant="body1"
          gutterBottom
          sx={{ color: getSecondaryColor() }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          A <Highlight>focused</Highlight>, <Highlight>AI-powered</Highlight> to-do list app designed for <Highlight>ADHD</Highlight> and <Highlight>neurodivergent</Highlight> minds, helping you stay grounded in what matters <Highlight>today</Highlight>.
        </Typography>
        <Button
          component={motion.button}
          variant="contained"
          sx={{ marginTop: 2, backgroundColor: getPrimaryColor(), color: 'white' }}
          onClick={onAddTodo}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          Add Your First Todo ✨📝
        </Button>
        <Typography
          variant="caption"
          sx={{ marginTop: 1, color: getSecondaryColor(), fontStyle: 'italic', display: 'block', textAlign: 'center' }}
        >
          Todai doesn’t require an account, doesn’t store your data on servers, and never shares your data. 🌟
        </Typography>
      </Box>
    </Box>
  );
};

export default WelcomeScreen;

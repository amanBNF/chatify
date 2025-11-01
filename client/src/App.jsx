import React, { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { Container, Stack, Typography } from '@mui/material';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';


const App = () => {

  const socket = useMemo(() => io('http://localhost:3000'), []);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', message);
    setMessage('');
  }

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected', socket.id);
    });

    socket.on('receive-message', (data) => {
      console.log(data);
    })

    socket.on('welcome', (message) => {
      console.log(message);
    });

    return () => {
      socket.disconnect();
    }
  }, []);


  return <Container maxWidth="sm">
    <Typography variant='h1' component='div' gutterBottom>
      Chat App
    </Typography>

    <form action="" onSubmit={handleSubmit} >
      <TextField
        value={message}
        onChange={e => setMessage(e.target.value)}
        id='outlined-basic'
        label='Type your message'
        variant='outlined'
        fullWidth />

      <Button
        type='sumbit'
        variant='contained'
        color='primary'>
        Send
      </Button>
    </form>

    <Stack>
      {
        messages.map((m, i) => (
          <Typography key={i} variant='h6' component='div' gutterBottom>
            {m}
          </Typography>
        ))
      }
    </Stack>
  </Container>
}

export default App
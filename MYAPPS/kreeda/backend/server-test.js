const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4001;

app.use(cors());
app.use(express.json());

// Mock users storage
let users = [];
let currentId = 1;

// Mock auth routes
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User exists' });
  }
  
  const user = { id: currentId++, name, email, password };
  users.push(user);
  
  res.status(201).json({ 
    token: 'mock-token-' + user.id, 
    user: { id: user.id, name, email } 
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  
  res.json({ 
    token: 'mock-token-' + user.id, 
    user: { id: user.id, name: user.name, email } 
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Krida Test API Ready!', users: users.length });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
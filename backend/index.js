const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
// Data storage (in-memory for simplicity)
let employees = [];

// Fetch data from an external API and store it
async function fetchData() {
    console.log("fetching data");
    try {
        let fetchedUsers = [];
        let page = 1;
        while (fetchedUsers.length < 10) {
            const response = await axios.get(`https://jsonplaceholder.typicode.com/users`);
            fetchedUsers = fetchedUsers.concat(response.data);
            page++;
        }
        employees = fetchedUsers.slice(0, 100); // Only keep the first 100 users
        console.log('Data fetched successfully.');
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

// Fetch data on server start
async function startServer() {
    await fetchData();
    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer();


// Routes

// Get all employees
app.get('/api/employees', (req, res) => {
    res.json(employees);
});

// Add a new employee
app.post('/api/employees', (req, res) => {
    const newEmployee = req.body;
    employees.push(newEmployee);
    res.status(201).json(newEmployee);
});

// Get employee by user_id
app.get('/api/employees/:user_id', (req, res) => {
    const userId = parseInt(req.params.user_id);
    const employee = employees.find(emp => emp.id === userId);
    if (employee) {
        res.json(employee);
    } else {
        res.status(404).json({ error: 'Employee not found' });
    }
});

// Update an employee by user_id
app.put('/api/employees/:user_id', (req, res) => {
    const userId = parseInt(req.params.user_id);
    const updatedEmployee = req.body;
    for (let i = 0; i < employees.length; i++) {
        if (employees[i].id === userId) {
            employees[i] = { ...employees[i], ...updatedEmployee };
            return res.json(employees[i]);
        }
    }
    res.status(404).json({ error: 'Employee not found' });
});

// Delete an employee by user_id
app.delete('/api/employees/:user_id', (req, res) => {
    const userId = parseInt(req.params.user_id);
    const index = employees.findIndex(emp => emp.id === userId);
    if (index !== -1) {
        employees.splice(index, 1);
        res.status(204).end();
    } else {
        res.status(404).json({ error: 'Employee not found' });
    }
});
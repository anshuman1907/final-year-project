const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
let employees = require('./users.json');

// Middleware
app.use(bodyParser.json());
app.use(cors());


function writeToFile(jsonData){
    fs.writeFile('users.json', JSON.stringify(jsonData), (err) => {
        if (err) {
            console.error('Error writing file', err);
        } else {
            console.log('JSON file has been written');
        }
    });
}

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});


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
require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const Item = require('./models/item');

const app = express();

app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(express.json()); // To parse JSON requests

// Root route to display items and add new ones
app.get('/', async (req, res) => {
    try {
        // Fetch all items from the database
        const items = await Item.find();

        // HTML with a form to add items and a list of existing items
        const responseHtml = `
            <html>
            <head>
                <title>DevSecOps App</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        margin: 0;
                        padding: 0;
                        background: linear-gradient(to right, #f8f9fa, #e9ecef);
                        color: #343a40;
                    }
                    header {
                        background: #343a40;
                        color: white;
                        padding: 20px;
                        text-align: center;
                        font-size: 24px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    .content {
                        max-width: 900px;
                        margin: 30px auto;
                        padding: 20px;
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
                        animation: fadeIn 1s ease-in-out;
                    }
                    h1, h2 {
                        color: #007BFF;
                    }
                    form {
                        margin-bottom: 30px;
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                    }
                    label {
                        font-weight: bold;
                        font-size: 16px;
                    }
                    input, textarea {
                        width: 100%;
                        padding: 12px;
                        border: 2px solid #ced4da;
                        border-radius: 6px;
                        font-size: 14px;
                        transition: border-color 0.3s ease;
                    }
                    input:focus, textarea:focus {
                        border-color: #007BFF;
                        outline: none;
                        box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
                    }
                    button {
                        padding: 12px 20px;
                        background-color: #007BFF;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 16px;
                        cursor: pointer;
                        transition: background-color 0.3s ease, transform 0.2s ease;
                    }
                    button:hover {
                        background-color: #0056b3;
                        transform: scale(1.05);
                    }
                    .container {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 20px;
                        margin-top: 20px;
                    }
                    .box {
                        padding: 20px;
                        border-radius: 12px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                        background-color: #fdfdfd;
                        transition: transform 0.2s ease, box-shadow 0.3s ease;
                        text-align: center;
                    }
                    .box:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
                    }
                    .box h3 {
                        margin-bottom: 10px;
                        color: #343a40;
                    }
                    .box p {
                        color: #6c757d;
                    }
                    footer {
                        text-align: center;
                        padding: 15px;
                        background-color: #343a40;
                        color: white;
                        position: fixed;
                        bottom: 0;
                        width: 100%;
                        box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                </style>
            </head>
            <body>
                <header>
                    Welcome to the DevSecOps Node.js App!
                </header>
                <div class="content">
                    <h2>Add a New Item</h2>
                    <form action="/add-item" method="POST">
                        <label for="name">Name:</label>
                        <input type="text" id="name" name="name" placeholder="Enter item name" required>
                        <label for="description">Description:</label>
                        <textarea id="description" name="description" rows="4" placeholder="Enter item description" required></textarea>
                        <button type="submit">Add Item</button>
                    </form>
                    <h2>Items from Database</h2>
                    <div class="container">
                        ${items
                            .map(
                                (item) => `
                            <div class="box">
                                <h3>${item.name}</h3>
                                <p>${item.description}</p>
                            </div>`
                            )
                            .join('')}
                    </div>
                </div>
                <footer>
                    DevSecOps Node.js App &copy; 2024 | Created with ❤️
                </footer>
            </body>
            </html>
        `;
        res.status(200).send(responseHtml);
    } catch (error) {
        res.status(500).send('Error fetching data from the database');
    }
});

// Route to handle form submissions and add new items to the database
app.post('/add-item', async (req, res) => {
    try {
        const { name, description } = req.body;

        // Create a new item and save it to the database
        const newItem = new Item({ name, description });
        await newItem.save();

        // Redirect back to the root route
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error saving item to the database');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

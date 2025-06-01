// backend/server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const knex = require('knex')(require('./knexfile').development); // Use 'development' configuration
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // for parsing application/json

//  Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Server is running');
});

// GET all contacts
app.get('/contacts', async (req, res) => {
  try {
    const contacts = await knex('contacts').select('*');
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// GET contact by ID
app.get('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await knex('contacts').where({ id }).first(); // .first() to get single object
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ error: 'Contact not found' });
    }
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// POST create a contact
app.post('/contacts', async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  try {
    const [id] = await knex('contacts').insert({ name, email, phone });
    // Fetch the newly created contact to respond with its full data
    const newContact = await knex('contacts').where({ id }).first();
    res.status(201).json({ ...newContact, message: 'Contact created successfully' });
  } catch (error) {
    console.error('Error creating contact:', error);
    // Check for SQLite unique constraint violation (error code might vary slightly by driver/OS)
    // For sqlite3 package, common error code is SQLITE_CONSTRAINT
    if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes('UNIQUE constraint failed: contacts.email')) {
      return res.status(409).json({ error: 'Email already exists.' }); // 409 Conflict
    }
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// PUT update a contact
app.put('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  if (!name || !phone) { // Basic validation
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  try {
    const updated = await knex('contacts').where({ id }).update({ name, email, phone });
    if (updated) {
        const updatedContact = await knex('contacts').where({ id }).first(); // Fetch the updated contact
        res.json({ contact: updatedContact, message: 'Contact updated successfully' }); // Respond with the updated contact
    } else {
        res.status(404).json({ error: 'Contact not found' });
    }
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// DELETE a contact
app.delete('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await knex('contacts').where({ id }).del();
    if (deleted) {
      res.json({ message: 'Contact deleted successfully' });
    } else {
      res.status(404).json({ error: 'Contact not found' });
    }
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


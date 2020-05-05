const app = require('./app');
const Photo = require('./models/photo');
const getConnection = require('./db/pool');
const express = require('express');

/**
 * Set-up the end point for serving the photos we have stored in the database
 */
app.get('/photo/:photo_id', async function (req, res) {
  if(!req.user) {
    res.set(401);
    res.end();
    return;
  }
  let connection;
  try {
    connection = await getConnection();
    const result = await Photo.findById(req.params.photo_id, connection);
    if(!result) {
      res.set(400);
      res.end();
      return;
    }
    res.set("Content-Type", result.mimetype);
    res.set(200);
    for await(let chunk of result.photo) {
      res.write(chunk);
    }
    result.photo.destroy();
    res.end();
  } finally {
    try {
      await connection.close();
    } catch (err) {
      console.error(err);
    }
  }
});

/**
 * This allows for the frontend to optionally be served through the node server as well
 */
app.use('/client', express.static('client'));
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.use(express.json({ limit: '10mb' }));

app.listen(3000, () => console.log('Server running on port 3000'));
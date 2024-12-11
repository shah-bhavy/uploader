const express = require('express');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Forward the uploaded file to Hostinger
    try {
        const filePath = path.join(__dirname, 'uploads', req.file.filename);
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));

        const response = await axios.post(`https://${process.env.HOSTINGER_DOMAIN}/upload.php`, form, {
            headers: form.getHeaders()
        });

        if (response.status === 200) {
            res.send('File uploaded and forwarded successfully.');
        } else {
            res.status(response.status).send('Failed to forward the file.');
        }
    } catch (error) {
        console.error('Error forwarding the file:', error);
        res.status(500).send('Error forwarding the file.');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

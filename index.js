// server.js - Mediasoup SFU Server
import express from 'express';
import http from 'http';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const app = express();
const server = http.createServer(app);



const __filename=fileURLToPath(import.meta.url);
const __dirname=dirname(__filename);
app.use(express.static(path.join(__dirname,'src')));

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/src/client.html')
})




// Start server
async function startServer() {
  
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Mediasoup server running on port ${PORT}`);
  });
}

startServer().catch(console.error);
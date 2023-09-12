const express = require('express');
const InspectModule = require("docxtemplater/js/inspect-module");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const fs = require("fs");

app.use(express.static(path.join(__dirname)));


const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  
})

server.listen(port, host, () => {
    console.log('listening on *:3000');
  });


io.on("connection", (socket) => {
   
   socket.on("sendToBack", (content)=>{
    try{
      const iModule = InspectModule();
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, { modules: [iModule], delimiters: { start: "[", end: "]"}}, );
      const tags = iModule.getAllTags();
      socket.emit("sendToFront", tags, content)
    } catch(err){
      
      socket.emit("sendToError", "There are unclosed tags somewhere in your file. Please review and edit your .docx.")
    }
   })
});

const http = require('http');
const fs = require('fs');


const server = http.createServer((req, res) => {
    fs.readFile('datos.txt', 'base64', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-type': 'text/plain' }),
            res.end('Error interno en el servidor')
        }else{
            res.writeHead(200, {'Content-type':'text/plain'})
            res.end(data)
        }
    });

});
const PORT = 3000;
server.listen(PORT,()=>{
    console.log(`Server running in http://localhost:${PORT}`);
})

// console.log(server);

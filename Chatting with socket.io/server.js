let app = require("express")()
let http = require("http").Server(app);
let io = require("socket.io")(http);

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
})

io.on('connection',(socket)=>{
    console.log("Client connected to application.....");

    socket.on('name',(n)=>{
        console.log("Hello "+n)
    })
    socket.on('msg',(msg)=>{
        console.log("Your message: "+msg)
    })
})

http.listen(9090,()=>console.log('server running on port 9090'))
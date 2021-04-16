let app = require("express")()
let http = require("http").Server(app);
let io = require("socket.io")(http);

let obj = require('mongoose')   //load the module
obj.Promise = global.Promise    //creating the reference
let url = 'mongodb://localhost:27017/meanstack'
const mongooseDbOptions ={  //to avoid warning
    useNewUrlParser: true,
    useUnifiedTopology: true
}
//define the schema
const ChatSchema = obj.Schema({
    name:String,
    message:String
})

var sender;
var message;

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
})

io.on('connection',(socket)=>{
    console.log("Client connected to application.....");
    socket.on('name',(n)=>{
        console.log("Hello "+n)
        sender = n;
    })
    socket.on('msg',(msg)=>{
        console.log("Your message: "+msg);
        message = msg;
        save();
    })
})

function save(){
    console.log(sender)
    console.log(message)
    if(sender!= undefined){
        obj.connect(url,mongooseDbOptions)    //ready to connect
        let db = obj.connection //connected to database
        db.on('error',(err)=>console.log(err))
        db.once('open',()=>{
            //Creating model using schema
            let Chat = obj.model("",ChatSchema,'ChatLog')

            //creating reference using model
            let c1 = new Chat({name:sender,message:message})
            c1.save((err,result)=>{
                if(!err){
                    console.log('record inserted successfully '+result)
                } else{
                    console.log(err)
                }
                obj.disconnect()
            })

        })
    }
}

http.listen(9090,()=>console.log('server running on port 9090'))
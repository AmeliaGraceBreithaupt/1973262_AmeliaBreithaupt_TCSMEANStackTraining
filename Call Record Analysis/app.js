let fs = require("fs")
let obj = require('mongoose')   //load the module
obj.Promise = global.Promise    //creating the reference
let url = 'mongodb://localhost:27017/meanstack'
const mongooseDbOptions ={  //to avoid warning
    useNewUrlParser: true,
    useUnifiedTopology: true
}
obj.connect(url,mongooseDbOptions)    //ready to connect
let db = obj.connection //connected to database
db.on('error',(err)=>console.log(err))
db.once('open',()=>{

    //define the schema
    let CallSchema = obj.Schema({
        _id:Number,
        source:String,
        destination:String,
        sourceLocation:String,
        destinationLocation:String,
        callDuration:String,
        roaming:String,
        callCharge:String
    })
    //Creating model using schema
    let Call = obj.model("",CallSchema,'Calls')

    fs.readFile("call_data.json",(err,data)=>{
        if(!err){
            let callString = data.toString()
            let callJson = JSON.parse(callString)
            for (let i = 0;i<callJson.length;i++){
              //creating reference using model
              //console.log(callJson[i])
                let c1 = new Call(callJson[i])
                c1.save((err,result)=>{
                    if(!err){
                        console.log('record inserted successfully '+result)
                    } else{
                        console.log(err)
                    }
                    obj.disconnect()
                })  
            }
        }
    })
})
let app = require('express')();
let url = require("url");
let obj = require('mongoose')   //load the module
obj.Promise = global.Promise    //creating the reference
let uri = 'mongodb://localhost:27017/meanstack'
const mongooseDbOptions ={  //to avoid warning
    useNewUrlParser: true,
    useUnifiedTopology: true
}
//define the schema
const CourseSchema = obj.Schema({
    _id:Number,
    name:String,
    description:String,
    cost:Number
})

class Course {
    constructor(id,name,desc,cost) {
        this._id = id;
        this.name = name;
        this.description = desc;
        this.cost = cost;
    }   
}
app.get("/",(req,res)=>{
    let name = url.parse(req.url,true).query.name;
    console.log(name);
    if(name == "Add Course"){
        res.sendFile(__dirname+"/addCourse.html")
    }else if(name == "Delete Course"){
        res.sendFile(__dirname+"/deleteCourse.html");
    } else if(name == 'Update Course'){
        res.sendFile(__dirname+"/updateCourse.html")
    } else{
        res.sendFile(__dirname+"/index.html")
    }
})
app.get("/storeCDetails",(req,res)=>{
    let data = url.parse(req.url,true).query;
    // retrieve data from body part
    let course = new Course(data.id,data.name,data.desc,data.cost);
    console.log(course)
    if(course._id != undefined){
        // connect to database
        obj.connect(uri,mongooseDbOptions)    //ready to connect
        const db = obj.connection;
        var CourseModel = obj.model("",CourseSchema,'Courses')
        CourseModel.create(course,(err,result)=>{
            if(!err){
                console.log('record inserted successfully '+result)
            } else{
                console.log(err)
            }
            obj.disconnect()
        })
    }
    res.sendFile(__dirname+"/index.html")
})
app.get("/deleteCDetails",(req,res)=>{    //course id = cid
        // retrieve data from body part
    let id = url.parse(req.url,true).query.id;
    console.log(id);
    if(id != undefined){
        // connect to database
        obj.connect(uri,mongooseDbOptions)    //ready to connect
        const db = obj.connection;
        var CourseModel = obj.model("",CourseSchema,'Courses')
        CourseModel.deleteOne({_id:id},(err,result)=> {
            if(!err){
                //console.log(result)
                if(result.deletedCount>0){
                    console.log("record deleted")
                } else{
                    console.log("Record not present")
                }
            } else{
                console.log(err);
            }
            obj.disconnect()
        })
    }
    res.sendFile(__dirname+"/index.html")
})
app.get("/updateCDetails/",(req,res)=>{    //course id = cid

    // retrieve data from body part
    // connect to database
    // store in database
    res.sendFile(__dirname+"/index.html")
})
app.get("/fetch",(req,res)=>{
    //res.write('All Courses')
    // connect to database
    obj.connect(uri,mongooseDbOptions)    //ready to connect
    const db = obj.connection;
    var CourseModel = obj.model("",CourseSchema,'Courses')
    CourseModel.find({},(err,result)=>{
        if(!err){
            res.json(result)
        }
    })
    
})
app.listen(8800,()=>console.log("Running on port 8800..."))
let http = require("http")
let url = require("url")
let fs = require("fs")
let port = 8800

let tasks = new Array()
fs.readFile("tasks.json",(err,data)=>{
    if(!err){
        //convert from jason
        let tasksString = data.toString()
        let tasksJson = JSON.parse(tasksString)
        for (let i = 0;i<tasksJson.length;i++){
            tasks.push(tasksJson[i])
        }
    }})
let mainHTML = `
    <head>
    <title>Task Planner</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
    </head>
    <style>
    tr{
        border: solid black 2px;
    }
    td,th{
        padding: 5px;
    }
    h3{
        color:green;
    }
    h3,label,input,h1{
        text-align: center;
    }
    table{
        width: 80%;
    }
    </style>
    <div class="container">
        <div class="row">
            <div class="col-10">
                <h1 style="font-family: cursive; margin: 10px;">Task Planner</h1>
            </div> 
        </div>
        <div class="row">
            <div class="col-5">
                <h3>Add Task</h3>
                <form action="/store" method="get">
                    <label>Emp Id: </label>
                    <input type="text" name="empId"/><br>
                    <label>Task Id: </label>
                    <input type="text" name="taskId"/><br>
                    <label>Task: </label>
                    <input type="text" name="task"/><br>
                    <label>Deadline: </label>
                    <input type="text" name="deadline"/><br><br>
                    <input type="submit" value="Add Task" class="btn btn-sm btn-outline-success"/>
                </form>
            </div>
            <div class="col-5">
                <form action="/delete" method="get">
                    <h3>Delete Task</h3>
                    <label>Task Id: </label>
                    <input type="text" name="taskId"/><br><br>
                    <input type="submit" value="Delete Task" class="btn btn-outline-success btn-sm"/>
                </form>
            </div>
        </div>
    </div>
    <hr>
    <form action="/display">
        <div class="container">
            <div class="row">
                <div class="col-5">
                    <h3>Tasks</h3>
                </div>
                <div class="col-5">
                    <input type="submit" value="Show All Tasks" class="btn btn-outline-success btn-sm"/>
                </div>
            </div>
        </div>
    </form>
    `


class Task {
    constructor(empId,taskId,task,deadline){
        this.empId = empId
        this.taskId = taskId
        this.task = task
        this.deadline = deadline
    }
}

let server = http.createServer((req,res)=>{
    console.log(req.url)
    if(req.url != '/favicon.ico') {
        res.setHeader("content-type","text/html")
        res.write(mainHTML)
        var pathInfo = url.parse(req.url,true).pathname

        if(pathInfo == '/store'){
            let data = url.parse(req.url,true).query;
            //convert to object
            let obj = new Task(data.empId,data.taskId,data.task,data.deadline)
            let flag = 1
            //store records in object using push only if its not a duplicate
            tasks.find(t=>{
                if(t.taskId == data.taskId){
                    console.log(`Task with id ${data.taskId} already exists`)
                    flag = 0
                }
            })
            if (flag != 0){
                tasks.push(obj)
                //convert to string
                let jsonData = JSON.stringify(tasks)
                //store using fs module
                fs.writeFileSync("tasks.json",jsonData)
                console.log("file written")
            }
            res.end()

        } else if(pathInfo == '/delete'){
            let data = url.parse(req.url,true).query;
            let taskId = data.taskId
            //check for value using iterator or loop
            let index = null;
            for (let i = 0;i<tasks.length;i++){
                if(tasks[i].taskId == taskId) {
                    index = i;
                }
            }  
            //if task id not available, display error message
            if (index == null) {
                console.log("No such task to delete")
            } else {
                //remove task
                console.log("Deleted Task:")
                console.log(tasks.splice(index,1))
                //convert to string
                let jsonData = JSON.stringify(tasks)
                //store using fs module
                fs.writeFileSync("tasks.json",jsonData)
                console.log("file updated - task removed")
            }
            res.end()    

        } else if (pathInfo == '/display') {
            //read from file
            let tableHtml = `
            <div class="container">
            <div class="row">
                <table class="table table-striped">
                    <thead>
                        <tr style="background-color: green; color: white;">
                            <th>Emp Id</th>
                            <th>Task Id</th>
                            <th>Task</th>
                            <th>Deadline</th>
                        </tr>
                    </thead>
                <tbody>
                `
            fs.readFile("tasks.json",(err,data)=>{
                if(!err){
                    //convert from jason
                    let tasksString = data.toString()
                    let tasksJson = JSON.parse(tasksString) 
                    
                    for (let i = 0;i<tasksJson.length;i++){
                        tableHtml += `
                        <tr>
                            <td>${tasksJson[i].empId}</td>
                            <td>${tasksJson[i].taskId}</td>
                            <td>${tasksJson[i].task}</td>
                            <td>${tasksJson[i].deadline}</td>
                        </tr>
                        `
                    }                                 
                }
                tableHtml += `
                        
                </table>
                </div>
            </div>
        </div>
                    `
                //console.log(tableHtml)
                res.write(tableHtml)
                res.end()
            })
        }
        else if (pathInfo == '/') {
            res.end()
        } 
    }
    
})

server.listen(port,()=>console.log(`server running on port number ${port}`))
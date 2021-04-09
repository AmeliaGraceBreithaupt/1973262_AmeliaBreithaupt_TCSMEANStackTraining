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
    <div>
        <h1>Task Planner</h1>
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
            <input type="submit" value="Add Task"/>
        </form>
        <br>
        <form action="/delete" method="get">
            <h3>Delete Task</h3>
            <label>Task Id: </label>
            <input type="text" name="taskId"/>
            <input type="submit" value="Delete Task"/>
        </form>
        <br><hr>
        <form action="/display">
            <h3>Tasks</h3>
            <input type="submit" value="Show All Tasks"/>
        </form>
        <br>
    </div>
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
            //store records in object using push
            tasks.push(obj)
            //convert to string
            let jsonData = JSON.stringify(tasks)
            //store using fs module
            fs.writeFileSync("tasks.json",jsonData)
            console.log("file written")
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
                <table style="border: solid">
                    <thead style="padding: 10px">
                        <tr>
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
                        </tbody>
                    </table>
                    `
                //console.log(tableHtml)
                res.write(tableHtml)
                res.end()
            })
        }
    } else {
        res.end()
    }
    
})

server.listen(port,()=>console.log(`server running on port number ${port}`))
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
            fs.writeFileSync("tasks.json",jsonData) //HAVE TO READ AND WRITE OLD DATA FIRST OR JUST APPEND NEW
            console.log("file written")
            
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
                res.write("<b> No such task to delete </b>")
            } else {
                //remove task
                console.log("Removed task "+tasks.splice(index,1))
                //convert to string
                let jsonData = JSON.stringify(tasks)
                //store using fs module
                fs.writeFileSync("tasks.json",jsonData) //HAVE TO READ AND WRITE OLD DATA FIRST OR JUST APPEND NEW
                console.log("file updated - task removed")
            }
                
        } else if (pathInfo == '/display') {
            //read from file
            fs.readFile("tasks.json",(err,data)=>{
                if(!err){
                    //convert from jason
                    let tasksString = data.toString()
                    let tasksJson = JSON.parse(tasksString) 
                    let tableHtml = ``
                    for (let i = 0;i<tasksJson.length;i++){
                        
                    }               
                    //create table data variable using backtics ``
                        //create variable to hold html with beginning of table html
                    //iterate loop 
                        //append table rows to table
                    //after loop
                        //append end table html
                    /*
                    <tabel>
                        <tr>
                            <td>${variableName}</td>
                        </tr>
                    </table>
                    res.end(tableDataVariable);
                    */
                }
            })
        }
    }
    res.end('')
})

server.listen(port,()=>console.log(`server running on port number ${port}`))
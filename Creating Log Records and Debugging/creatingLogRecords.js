let addLog = () => {
    let fs = require("fs")
    let obj = require("readline-sync");     //npm install readline-sync

    class Person {
        constructor(f,l,g,e){
            this.fname = f
            this.lname = l
            this.gender = g
            this.email = e
            this.date = new Date()
        }
    }
    let people = new Array();

    //read from log to add any previous logs
    let data = fs.readFileSync("log.json");
    let jsonString = data.toString();
    let anotherJson = JSON.parse(jsonString);
    for (let i = 0;i<anotherJson.length;i++){
        debugger
        people.push(anotherJson[i])
    }
    debugger
    let addAnother = true;
    while (addAnother){
        //gather information
        let fname = obj.question("Enter your first name ");
        let lname = obj.question("Enter your last name ");
        let gender = obj.question("Enter your gender ");

        let email = obj.question("Enter your email ");
        //check if email is valid and contains @ symbol 
        while (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email) == false){
            console.log("INVALID EMAIL: must contain @");
            email = obj.question("Enter your email ");
        }
        let user = new Person(fname,lname,gender,email);

        //add new log
        people.push(user);
        let another = obj.question("Would you like to add another person? (y/n) ")
        //if statement to set addAnotehr value
        if(another.toLowerCase() == 'n'){
            addAnother = false;
        }
    }

    let jsonData = JSON.stringify(people);
    debugger
    fs.writeFileSync("log.json","\n"+jsonData);
    console.log("file written");
}
module.exports={addLog}
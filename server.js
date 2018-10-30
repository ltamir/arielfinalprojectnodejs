var express = require('express');
var app = express();
var bodyParser = require("body-parser"); 

app.use(express.static("."));
// load the JSON data
var fs = require('fs');
var usersData = JSON.parse(fs.readFileSync('users.json', 'utf8'));


// Use middlewares:
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var ok = {res:"person added"};
var nok = {res:"person already exists"};

// Add person: 
app.post("/api", function(request, response) {
    var person = request.body;

    console.log(person);
    var exists = false;
    for(i = 0; i<usersData.db.length; i++ ){
        if(usersData.db[i].name === person.name)
            exists = true;
    }
    // var exists = Boolean(usersData.db.filter((it) => {
    //     console.log(it.name + " == " + person.name + ": " + it.name.toString() === person.name);
    //     return it.name.toString() === person.name;
    // }));
    console.log("person exists: " + exists)
    if(!exists){
        usersData.db.push(person);
        var rawJson = JSON.stringify(usersData);
        fs.writeFileSync('users.json', rawJson);
        response.status(201); // Created.
        response.send(ok);
        console.log("sent ack");
    }
    else{
        response.status(400); // not created.
        response.send(nok);
        console.log("sent nack");
    }
    
});

var userListStart = "<!DOCTYPE html><html lang=\"en\"><head><title>User List</title></head><body><ol>";
var userListEnd = "</ol></body></html>"
app.get('/api/persons',(req,res)=>{
    var userListItems = "";
    res.status(200);
    for(i = 0; i<usersData.db.length; i++ ){
        userListItems += "<li>";
        userListItems += usersData.db[i].name + ", " + usersData.db[i].age + ", " + usersData.db[i].isMale + ", " + usersData.db[i].country
        userListItems += "</li>";
    }
    res.send(userListStart + userListItems + userListEnd);
    // res.send(JSON.stringify(usersData.db));
});

app.listen(3339);
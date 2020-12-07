// requiring all our dependacies 
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

// global variables
const PORT = process.env.PORT || 3001;
const db = require("./db/db.json")
let num = 0

// Middleware
// urlencoded middle to give us access to req.body
app.use(express.urlencoded({extended: true}));
app.use(express.json()); 

// middleware to have our css and js files loaded from public folder
app.use(express.static('public'))

// Routes
// html routes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// api route
app.get("/api/notes", (req, res) => {
    res.json(db);
});

// post new note to api
app.post("/api/notes", (req, res) => {
    num++
    const newNote= req.body;
        newNote.id = num;
        db.push(newNote)
    const updatedb = JSON.stringify(db)
    fs.writeFile("./db/db.json", updatedb, err=>{
        if(err){throw err}
    });
    res.json(updatedb)
});

// delete note from api
app.delete("/api/notes/:id", (req, res) => {
    const id = req.params.id;

    for(let i = 0; i < db.length; i++){
        if(db[i].id == id){
            db.splice(i,1);
        };
    };
   
    const updatedb = JSON.stringify(db);
    fs.writeFile("./db/db.json", updatedb, err=>{
        if(err) throw err
    });
    return res.send();
})

// Server listener
app.listen(PORT, () => {
    console.log("You started up the server");
});
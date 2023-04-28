import express from "express";
import mysql from "mysql2/promise";

const app = express();

app.set("view engine", "ejs");
app.use( express.static( "public" ) );
app.use(express.urlencoded({ extended: true }));

const con = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'blog-website',
    password: "MyServer123"
});

app.get("/recent", async (req, res) => {
    const [posts] = await con.query("SELECT * FROM post WHERE date=?", [new Date().toISOString().substring(0, 10)]);

    res.render("recent", { posts });
})

app.get("/search", async (req, res) => {
    if (!req.query?.content) {
        res.render("search", { posts: [] });
        return;
    }
    
    const [posts] = await con.query("SELECT * FROM post WHERE content LIKE ?", ['%' + req.query.content + '%']);

    res.render("search", { posts });
})

app.get("/new", (req, res) => {
    res.render("new");
})

app.post("/new", (req, res) => {
    const values = [
        req.body.content, 
        req.body.photoURL === "" ? null : req.body.photoURL, 
        new Date().toISOString().substring(0, 10), 
        req.body.location === "" ? null : req.body.location
    ]

    con.query("INSERT INTO post (content, photoURL, date, location) VALUES (?)", [values]);
    res.render("new");
})

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});
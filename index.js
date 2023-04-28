import express from "express";
import mysql from "mysql2/promise";

const app = express();

app.set("view engine", "ejs");
app.use( express.static( "public" ) );
app.use(express.urlencoded({ extended: true }));
app.use(express.json({type: '*/*'}));

const con = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'blog-website',
    password: "MyServer123"
});

app.get("/posts", async (req, res) => {
    const [posts] = await con.query("SELECT * FROM post ORDER BY date ASC");

    res.render("posts", { posts });
})

app.get("/search", async (req, res) => {
    if (!req.query?.content) {
        res.render("search", { posts: [] });
        return;
    }
    
    const [posts] = await con.query("SELECT * FROM post WHERE content LIKE ? ORDER BY date ASC", ['%' + req.query.content + '%']);

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

app.post("/delete", async (req, res) => {
    await con.query("DELETE FROM post WHERE postID=?", [req.body.postID]);
    res.send("success");
})

app.post("/update", async (req, res) => {
    await con.query("UPDATE post SET ? WHERE postID=?", [{ content: req.body.content, photoURL: req.body.photoURL, location: req.body.location }, req.body.postID]);
    res.redirect(req.headers.referer);
});

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});
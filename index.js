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
    password: "" //your password here
});

const formatResults = (results) => {
    const posts = [];
    let currentPost;

    for (const result of results) {
        const { postID, postContent, photoURL, postDate, location, commentID, commentContent, commentDate } = result;
        if (postID !== currentPost) {
            currentPost = result.postID;
            posts.push({ postID, postContent, photoURL, postDate, location, comments: [] });
        }

        if (commentID !== null) {
            posts[posts.length - 1].comments.push({ commentID, commentContent, commentDate });
        }
    }

    return posts;
}

app.get("/posts", async (req, res) => {
    const [results] = await con.query(
        "SELECT post.postID, post.content AS postContent, post.photoURL, post.date AS postDate, post.location, " +
        "comment.commentID, comment.content AS commentContent, comment.date AS commentDate " +
        "FROM post LEFT OUTER JOIN comment ON post.postID = comment.postID"
    );

    const posts = formatResults(results);

    res.render("posts", { posts });
})

app.get("/search", async (req, res) => {
    if (!req.query?.content) {
        res.render("search", { posts: [] });
        return;
    }

    const [results] = await con.query(
        "SELECT post.postID, post.content AS postContent, post.photoURL, post.date AS postDate, post.location, " +
        "comment.commentID, comment.content AS commentContent, comment.date AS commentDate " +
        "FROM post LEFT OUTER JOIN comment ON post.postID = comment.postID " +
        "WHERE post.content LIKE ?", ['%' + req.query.content + '%']
    );
    
    const posts = formatResults(results);

    res.render("search", { posts });
})

app.get("/newpost", (req, res) => {
    res.render("newpost");
})

app.post("/newpost", (req, res) => {
    const values = [
        req.body.content, 
        req.body.photoURL === "" ? null : req.body.photoURL, 
        new Date().toISOString().substring(0, 10), 
        req.body.location === "" ? null : req.body.location
    ]

    con.query("INSERT INTO post (content, photoURL, date, location) VALUES (?)", [values]);
    res.render("newpost");
})

app.post("/newcomment/:postID", async (req, res) => {
    const values = [req.params.postID, req.body.content, new Date().toISOString().substring(0, 10)];

    await con.query("INSERT INTO comment (postID, content, date) VALUES (?)", [values]);
    res.redirect(req.headers.referer);
})

app.post("/deletepost/:postID", async (req, res) => {
    await con.query("DELETE FROM comment WHERE postID=?", [req.params.postID]);
    await con.query("DELETE FROM post WHERE postID=?", [req.params.postID]);
    res.redirect(req.headers.referer);
})

app.post("/updatepost/:postID", async (req, res) => {
    await con.query("UPDATE post SET ? WHERE postID=?", [{ content: req.body.content, photoURL: req.body.photoURL, location: req.body.location }, req.params.postID]);
    res.redirect(req.headers.referer);
});

app.post("/deletecomment/:commentID", async (req, res) => {
    await con.query("DELETE FROM comment WHERE commentID=?", [req.params.commentID]);
    res.redirect(req.headers.referer);
})

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});
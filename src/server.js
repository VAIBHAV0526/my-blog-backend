import express from "express";
import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import  admin from "firebase-admin";
import { db, connecttodb } from "./db.js";
import 'dotenv/config';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const creadientials =JSON.parse(fs.readFileSync("/Users/vaibhav/Desktop/blog-project/my-blog-backend/crediential.json"));
admin.initializeApp({
    credential: admin.credential.cert(creadientials),
});
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "/build")));
app.get(/^(?!\/api).+/,(req,res)=>{
    res.sendFile(path.join(__dirname,"/build/index.html"));
})
app.use(
    async (req, res, next) => {
        const {authtoken}=req.headers;
        if(authtoken){
            try{
      req.user=   await admin.auth().verifyIdToken(authtoken);}
    
      catch(err){
         return res.sendStatus(400);// bad request
      }

    }
    req.user= req.user || {};
    next();
    }
)
app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params;
  const {uid}=req.user;
  const article = await db.collection("articles").findOne({ name });
  
  if (article) {
    const upvoteid=article.upvoteid || [];
    article.canUpvote= uid && !upvoteid.includes(uid);
    res.json(article);
  } else {
    res.status(404).json({ message: "Article not found" });
  }
});
app.use(express.json());
app.use((req, res, next) => {
    if(req.user){
        next();
    }
    else{
        res.sendStatus(401);
    }
});
app.put("/api/articles/:name/upvote", async (req, res) => {
  // create a fake databasse first
  const { name } = req.params;
  const {uid}=req.user;
  

  const article = await db.collection("articles").findOne({ name });
   
  if (article) {
    const upvoteid=article.upvoteid || [];
    article.canUpvote= uid && !upvoteid.includes(uid);
    if(article.canUpvote){
        await db.collection("articles").updateOne({ name }, { $inc: { upvotes: 1 } 
        , $push: { upvoteid: uid }});

    }
    const updatedarticle = await db.collection("articles").findOne({ name });
    res.json(updatedarticle);

  } 
  else {
    res.send(`the ${name} is not found`);
  }
});
app.post("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;
  const {text } = req.body;
  const {email}=req.user;

  await db
    .collection("articles")
    .updateOne({ name }, { $push: { Comments: { email, text } } });
  const article = await db.collection("articles").findOne({ name });
  if (article) {
    res.json(article);
  } else {
    res.send(`the ${name} is not found`);
  }
});
const port =process.env.PORT || 8000;
connecttodb(() => {
  console.log("connected to db");
  app.listen(port, () => {
    console.log("Listening on port",port);
  });
});
//

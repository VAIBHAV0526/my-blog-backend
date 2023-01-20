import express from "express";
import { MongoClient } from "mongodb";
import { db, connecttodb } from "./db.js";
const app = express();
app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params;
  const article = await db.collection("articles").findOne({ name });
  if (article) {
    res.json(article);
  } else {
    res.status(404).json({ message: "Article not found" });
  }
});
app.use(express.json());
app.put("/api/articles/:name/upvote", async (req, res) => {
  // create a fake databasse first
  const { name } = req.params;
  await db.collection("articles").updateOne({ name }, { $inc: { upvotes: 1 } });
  const article = await db.collection("articles").findOne({ name });
  if (article) {
    res.send(`the ${name} is upvoted ${article.upvotes} times`);
  } else {
    res.send(`the ${name} is not found`);
  }
});
app.post("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;
  const { postedby, text } = req.body;
  await db
    .collection("articles")
    .updateOne({ name }, { $push: { Comments: { postedby, text } } });
  const article = await db.collection("articles").findOne({ name });
  if (article) {
    res.send(article.Comments);
  } else {
    res.send(`the ${name} is not found`);
  }
});
connecttodb(() => {
  console.log("connected to db");
  app.listen(8000, () => {
    console.log("Listening on port 8000");
  });
});
//

import  express from 'express' ;
const app = express();
const articlesinfo=[{
    name:'learn-react',
    upvotes:0,
},
{
    name:'learn-node',
    upvotes:0,
}
]
app.use(express.json());
app.put('/api/articles/:name/upvote' ,(req,res) => {
    // create a fake databasse first
    const {name}=req.params;
    console.log(name);
    const article=articlesinfo.find(article=>article.name===name);
    if(article){
    article.upvotes+=1;
    res.send(`the ${name} is upvoted ${article.upvotes} times`);
    }else{
        res.send(`the ${name} is not found`);
    }
})
app.listen(8000,()=>{
    console.log('Listening on port 8000');
});
// 

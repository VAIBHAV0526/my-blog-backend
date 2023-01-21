import {MongoClient} from 'mongodb';

let db;

async function connecttodb(cb){
    const client= new MongoClient(`mongodb+srv://node-server:lsNT2CR1hCkRaxzb@cluster0.qixfbck.mongodb.net/?retryWrites=true&w=majority`);
    await client.connect();
    db=client.db('reactblogdb');
    cb();
}
export {
    db,
    connecttodb
    
}
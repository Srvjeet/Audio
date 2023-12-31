require('dotenv').config();
const express = require('express');
const app = express();
const natural = require('natural');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const tokenizer = new natural.WordTokenizer();

const corsOptions = {
    origin: process.env.APP_URL,
    methods: ['GET']
}

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, '/frontend/build')));

app.get('/api/response/:id',  async (req,res)=>{
    let response = await interactWithBot(req.params.id);
    res.send(response);
})

const readData = ()=>{
    return new Promise((resolve, reject)=>{
        fs.readFile('./training.json', (err,data)=>{
            if(err){
                reject(err);
                return;
            }
            else{
                resolve(data);
            }
        })
    })
}

const classifier = new natural.BayesClassifier();
// Training data
readData().then((data)=>{
    try{
        JSON.parse(data).forEach(item => {
        classifier.addDocument(tokenizer.tokenize(item.input), item.output);
        });
        classifier.train();
    }catch(parseError){
        console.log(parseError);
    }
}).catch(err=>console.log(err))

function interactWithBot(userMessage) {
    let botResponse = classifier.classify(tokenizer.tokenize(userMessage));
    return (botResponse);
}
app.listen(8080, ()=>{
    console.log('listening at 8080');
})


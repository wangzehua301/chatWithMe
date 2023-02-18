import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
})

app.post('/', async (req, res) => {
    try{
        const { prompt } = req.body
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        res.status(200).send({ bot: response.data.choices[0].text }) 
    }catch(err){
        console.log(err)
        res.status(500).send({ bot: "Sorry, I'm not feeling well today. Please try again later." })
    }
})

app.listen(5000, () => {
    console.log('Server started on port 5000')
})

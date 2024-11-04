const express = require('express')
require('dotenv').config({ path: '../.env' })
const app = express()
const port = 3000

app.get('/', (req, res) => {
    const data = fetchData().then(data => {
        const answer = data.split(/\r?\n/);
        console.log(answer.filter(item => item));
        console.log(process.env.AI_DEVS_KEY);
        postAnswer({
            task: 'POLIGON',
            apikey: process.env.AI_DEVS_KEY,
            answer: answer.filter(item => item)
        }).then((resp) => res.send(resp))
            .catch(err => res.send(err))

    })

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

interface IPoligonRequest {
    task: string,
    apikey: string,
    answer: any,
}

interface IPoligonResponse {
    code: number,
    message: string,
}

const fetchData = async () => {
    const resp = await fetch('https://poligon.aidevs.pl/dane.txt', );

    if (!resp.ok) {
        throw new Error(`Response status: ${resp.status}`);
    }

    return resp.text();
}

const postAnswer = async (request: IPoligonRequest): Promise<IPoligonResponse> => {
    const rawResponse = await fetch('https://xyz.ag3nts.org/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    });
    return await rawResponse.json();
}
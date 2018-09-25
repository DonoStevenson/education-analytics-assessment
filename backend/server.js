const express = require('express')
const request = require('request');
const port = 4000
const app = express()

const apiEndPoint = "https://api.data.gov/ed/collegescorecard/v1/schools?"
const query = "school.operating=1&2015.academics.program_available.assoc_or_bachelors=true" +
    "&2015.student.size__range=1..&school.degrees_awarded.predominant__range=1..3" +
    "&school.degrees_awarded.highest__range=2..4&id=240444" +
    "&api_key=3hv7r0a1ioqWSWY32Yja6VafGuGYK0LIEu2BARqa"
app.get('/schools', function(req, res){
    console.log('heloo')
    request(apiEndPoint+query, function(err,response,body) {
        res.send(body)
    });
});

app.listen(port, () => console.log(`started at ${port}`))
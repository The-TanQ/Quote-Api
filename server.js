const express = require('express');
const app = express();

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const PORT = process.env.PORT || 4001;


app.use(express.static('public'));

app.get('/api/quotes/random', (req,res,next) => {
  res.send({
    quote: getRandomElement(quotes)
  });
});

app.get('/api/quotes', (req,res,next) => {
  if (req.query.person) {
    const personQuotes = quotes.filter(quote => quote.person === req.query.person);
    res.send({
      quotes: personQuotes
    });
  } else {
    res.send({
      quotes: quotes
    });
  }
});

app.post('/api/quotes', (req,res,next) => {
  if (req.query.person && req.query.quote) {
    const newQuote = {
      quote: req.query.quote,
      person: req.query.person,
      id: (quotes.length + 1)
    }
    quotes.push(newQuote);
    res.send({ quote: newQuote });
  } else {
    res.status(400).send('Quote Not Added');
  }
});

app.put('/api/quotes/:id', (req,res,next) => {
  if (req.params.id >= 0 && req.params.id < quotes.length) {
    quotes[req.params.id].quote = req.query.quote;
    quotes[req.params.id].person = req.query.person;
    res.send({ quote: quotes[req.params.id] });
  } else {
    res.status(400).send('Quote Not Updated');
  }
});

//Add a DELETE route for deleting quotes from the data array.
app.delete('/api/quotes/:id', (req,res,next) => {
  if (req.params.id >= 0 && req.params.id < quotes.length) {
    quotes.splice(req.params.id, 1);
    res.status(200).send({ qoute: quotes[req.params.id]});
  } else {
    res.status(400).send('Quote Not Deleted');
  }
});

app.listen(PORT, (err) => {
  if (err) console.log("Error in server setup")
  console.log("Server listening on Port", `http://Localhost:${PORT}`)
});


const express = require('express');
const path = require('path');
const hbs = require('hbs');

const app = express();

const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views/layouts'));
app.set('view options', { layout: 'layouts/main' });

app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.render('index', { layout: 'layouts/main' });
});

app.get('/about', (req, res) => {
  res.render('about', { layout: 'layouts/main' });
});

app.get('/catalog', (req, res) => {
  res.render('catalog', { layout: 'layouts/main' });
});

app.get('/contacts', (req, res) => {
  res.render('contacts', { layout: 'layouts/main' });
});

app.get('/api', (req, res) => {
  res.json({"msg": "Hello world"});
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

let DB;
if (process.env.NODE_ENV === 'development') DB = process.env.DATABASE_LOCAL;
else
  DB = process.env.DATABASE_DEPLOYED.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );

mongoose.connect(DB).then(() => {
  console.log('DB connection successful');
});

const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port);

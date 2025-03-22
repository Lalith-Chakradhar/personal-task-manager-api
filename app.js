import express from 'express';
import routes from './routes/index.js';
import errorHandler from './middlewares/error.js';
import config from './config/config.js';

const app = express();

app.use(express.json());


app.use('/', routes);

app.use(errorHandler);


const port = config.port;

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
});

import express from 'express';
import { Worker } from 'worker_threads';
import path from 'path';

import ServerError from '../ServerError';

const RES_TIMEOUT = 20000;

const app = express();

app.get('/api/t9/:number', (req, res) => {
  try {
    let worker: Worker;
    const { number } = req.params;
    const isNumber = /^\d+$/.test(number);

    res.setTimeout(RES_TIMEOUT, () => {
      const err = new ServerError({
        message: `Server error: Response timeout: ${RES_TIMEOUT}`,
        code: 'timeout',
      });
      res.send({
        res: [],
        err,
      });

      worker.terminate();
      worker.unref();
    });

    if (!isNumber) {
      const err = new ServerError({
        message: `Server error: '${number}' should be a number`,
        code: 'invalid_input',
      });
      res.send({
        res: [],
        err,
      });
      return;
    }

    worker = new Worker(path.resolve(__dirname, './worker.import.js'));
    worker.once('message', ({ result }: Record<string, []>) => {
      res.send({ res: result });

      worker.unref();
    });
    worker.on('exit', (code) => console.warn('exit', code));
    worker.on('error', (err) => console.error('error', err));

    worker.postMessage({ number });
  } catch (err) {
    console.error(err);
  }
});

app.listen(8080, () => console.log(`Listening on port ${8080}!`));

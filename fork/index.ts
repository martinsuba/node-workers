import express from 'express';
import { fork, ChildProcess } from 'child_process';
import path from 'path';

import ServerError from '../ServerError';

const RES_TIMEOUT = 20000;

const app = express();

app.get('/api/t9/:number', (req, res) => {
  try {
    let worker: ChildProcess;
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

      if (worker && !worker.killed) {
        worker.kill();
      }
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

    worker = fork(path.resolve(__dirname, './worker'));
    worker.on('message', ({ result }: Record<string, []>) => {
      res.send({ res: result });

      worker.kill();
    });

    worker.send({ number });
  } catch (err) {
    console.error(err);
  }
});

app.listen(8080, () => console.log(`Listening on port ${8080}!`));

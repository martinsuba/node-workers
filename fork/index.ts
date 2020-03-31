import express from 'express';
import { fork } from 'child_process';
import path from 'path';

import ServerError from '../ServerError';

const app = express();

app.get('/api/t9/:number', (req, res) => {
  const { number } = req.params;
  const isNumber = /^\d+$/.test(number);

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

  const worker = fork(path.resolve(__dirname, './worker'));
  worker.on('message', ({ result }: Record<string, []>) => {
    res.send({ res: result });
    worker.kill();
  });

  worker.send({ number });
});

app.listen(8080, () => console.log(`Listening on port ${8080}!`));

import t9 from '../t9';

process.on('message', ({ number }) => {
  const result = t9(number);
  if (process.send) {
    process.send({ result });
  }
});

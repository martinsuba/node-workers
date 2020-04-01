import { isMainThread, parentPort } from 'worker_threads';

import t9 from '../t9';

if (!isMainThread && parentPort) {
  parentPort.on('message', ({ number }) => {
    const result = t9(number);

    if (parentPort) {
      parentPort.postMessage({ result });
    }
  });
}

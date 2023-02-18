import { clientCredentials } from '../utils/client';

const dbUrl = clientCredentials.databaseURL;

const createSnippet = (payload) => new Promise((resolve, reject) => {
  fetch(`${dbUrl}/snippets.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

export default createSnippet;

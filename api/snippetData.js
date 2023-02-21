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

const updateSnippet = (payload) => new Promise((resolve, reject) => {
  fetch(`${dbUrl}/snippets/${payload.firebaseKey}.json`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then(resolve)
    .catch(reject);
});

const getSingleSnippet = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${dbUrl}/snippets/${firebaseKey}.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }, // you technically do not need the options object for GET requests, but using it here for consistency
  })
    .then((response) => response.json())
    .then((data) => resolve(data)) // will resolve a single object
    .catch(reject);
});

export { createSnippet, updateSnippet, getSingleSnippet };

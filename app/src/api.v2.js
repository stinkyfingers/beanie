import { apiHost } from './config'

// beanies

const family = (token, family, startKey) => {
  console.log('family called')
  return fetch(`${apiHost}/v2/beanies/${family}/${startKey}`, {
    method: 'GET',
    headers: { token }
  })
    .then(resp => resp.json());
};

const get = (token, family, name) => {
  return fetch(`${apiHost}/v2/beanie/${family}/${name}`, {
    method: 'GET',
    headers: { token }
  })
    .then(resp => resp.json());
};

const create = (token, beanie) => {
  return fetch(`${apiHost}/v2/beanie`, {
    method: 'POST',
    headers: { token },
    body: JSON.stringify(beanie)
  })
    .then(resp => resp.json());
};

const remove = (token, family, name) => {
  return fetch(`${apiHost}/v2/beanie/${family}/${name}`, {
    method: 'DELETE',
    headers: { token }
  })
    .then(resp => resp.json());
};



export {
  family,
  get,
  create,
  remove
};

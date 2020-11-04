import { apiHost } from './config'

const family = (family, startKey) => {
  return fetch(`${apiHost}/v2/beanies/${family}/${startKey}`, {
    method: 'GET'
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
    headers: { token, 'Content-Type': 'application/json' },
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

// user

const login = (user) => {
  return fetch(`${apiHost}/login`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {'Content-Type': 'application/json'}
    })
      .then(resp => resp.json());
};

const register = (user) => {
  return fetch(`${apiHost}/user`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {'Content-Type': 'application/json'}
    })
      .then(resp => resp.json());
};

const updateWantList = (user) => {
  return fetch(`${apiHost}/user/wantlist`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
        'token': user.token
      }
    })
      .then(resp => resp.json());
};

const updateMyBeanies = (user) => {
  return fetch(`${apiHost}/user/beanies`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
        'token': user.token
      }
    })
      .then(resp => resp.json());
};

const resetPassword = async (user) => {
  return fetch(`${apiHost}/password`, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(resp => resp.json());
};

const users = (token) => {
  return fetch(`${apiHost}/users`, {
      method: 'GET',
      headers: {'token': token}
    })
      .then(resp => resp.json());
};

export {
  family,
  get,
  create,
  remove,
  login,
  register,
  updateWantList,
  updateMyBeanies,
  resetPassword,
  users
};

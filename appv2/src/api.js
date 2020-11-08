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
  return fetch(`${apiHost}/v2/login`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(resp => resp.json());
};

const register = (user) => {
  return fetch(`${apiHost}/v2/user`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(resp => resp.json());
};

const updateWantList = (user) => {
  return fetch(`${apiHost}/v2/user`, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
        'token': user.token
      }
    })
      .then(resp => resp.json());
};
// TODO de-dupe w/ above
const updateMyBeanies = (user) => {
  return fetch(`${apiHost}/v2/user`, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
        'token': user.token
      }
    })
      .then(resp => resp.json());
};

const resetPassword = async (username) => {
  return fetch(`${apiHost}/v2/password/${username}`, {
      method: 'GET'
    })
      .then(resp => resp.json());
};

const newPassword = async (token, user) => {
  return fetch(`${apiHost}/v2/password`, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
        'token': user.token
      }
    })
      .then(resp => resp.json());
};

const users = (token) => {
  return fetch(`${apiHost}/v2/users`, {
      method: 'GET',
      headers: { token }
    })
      .then(resp => resp.json());
};

const user = (token, username) => {
  return fetch(`${apiHost}/v2/user/${username}`, {
      method: 'GET',
      headers: { token }
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
  newPassword,
  users,
  user
};

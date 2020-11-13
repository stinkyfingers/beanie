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

// const updateWantList = (user) => {
//   return fetch(`${apiHost}/v2/user/wantList`, {
//       method: 'PUT',
//       body: JSON.stringify({ ...user, beanies: null }),
//       headers: {
//         'Content-Type': 'application/json',
//         'token': user.token
//       }
//     })
//       .then(resp => resp.json());
// };
//
// const updateMyBeanies = (user) => {
//   return fetch(`${apiHost}/v2/user/beanies`, {
//       method: 'PUT',
//       body: JSON.stringify({ ...user, wantList: null }),
//       headers: {
//         'Content-Type': 'application/json',
//         'token': user.token
//       }
//     })
//       .then(resp => resp.json());
// };

const addToList = (user, listType, family, beanieName) => {
  return fetch(`${apiHost}/v2/user/${listType}/${family}/${beanieName}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'token': user.token
      }
    })
      .then(resp => resp.json());
};

const removeFromList = (user, listType, family, beanieName) => {
  return fetch(`${apiHost}/v2/user/${listType}/${family}/${beanieName}`, {
      method: 'DELETE',
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
  addToList,
  removeFromList,
  resetPassword,
  newPassword,
  users,
  user
};

// const host = 'https://server.john-shenk.com/beanieboo'
// const host = 'http://localhost:3001'
import { apiHost } from './config'

export const login = async (user) => {
  try {
    const resp = await fetch(`${apiHost}/login`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {'Content-Type': 'application/json'}
    });
    const u = await resp.json();
    if (u.error) return {error: u.error};
    return u;
  } catch (err) {
    return {error: err};
  }
};

export const register = async (user) => {
  try {
    const resp = await fetch(`${apiHost}/user`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {'Content-Type': 'application/json'}
    });
    const u = await resp.json();
    if (u.error) return {error: u.error};
    return u;
  } catch (err) {
    return {error: err};
  }
};

export const users = async (token) => {
  try {
    const resp = await fetch(`${apiHost}/users`, {
      method: 'GET',
      headers: {'token': token}
    });
    const u = await resp.json();
    if (u.error) return {error: u.error};
    return u;
  } catch (err) {
    return {error: err};
  }
};

export const getFamily = async (token, family, startKey) => {
  try {
    const headers = {
      token
    };
    if (startKey !== '') headers.startkey = startKey
    const resp = await fetch(`${apiHost}/beanies/${family}`, {
      method: 'GET',
      headers
    });
    const u = await resp.json();
    if (u.error) {
      console.log('JSON ERROR: ', u)
      return {error: u.error};
    };
    return u;
  } catch (err) {
    return {error: err};
  }
};

export const updateWantList = async (user) => {
  try {
    const resp = await fetch(`${apiHost}/user/wantlist`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
        'token': user.token
      }
    });
    const u = await resp.json();
    if (u.error) return {error: u.error};
    return u;
  } catch (err) {
    return {error: err};
  }
};

export const updateMyBeanies = async (user) => {
  try {
    const resp = await fetch(`${apiHost}/user/beanies`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
        'token': user.token
      }
    });
    const u = await resp.json();
    if (u.error) return {error: u.error};
    return u;
  } catch (err) {
    return {error: err};
  }
};

export const get = async (token, name, family) => {
  try {
    const resp = await fetch(`${apiHost}/beanie/${family}/${name}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      }
    });
    const u = await resp.json();
    return u;
  } catch (err) {
    return {error: err};
  }
};

export const upsert = async (token, beanie) => {
  try {
    const resp = await fetch(`${apiHost}/beanies`, {
      method: 'POST',
      body: JSON.stringify(beanie),
      headers: {
        'Content-Type': 'application/json',
        'token': token
      }
    });
    const u = await resp.json();
    return u;
  } catch (err) {
    return {error: err};
  }
};

export const deleteBeanie = async (token, name, family) => {
  try {
    const resp = await fetch(`${apiHost}/beanie/${family}/${name}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      }
    });
    const u = await resp.json();
    return u;
  } catch (err) {
    return {error: err};
  }
};

export const resetPassword = async (user) => {
  try {
    const resp = await fetch(`${apiHost}/password`, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const u = await resp.json();
    if (u.error) return {error: u.error};
    return u;
  } catch (err) {
    return {error: err};
  }
};

export const getProxyImage = async (url) => {
  return `${apiHost}/image?url=${url}`
}

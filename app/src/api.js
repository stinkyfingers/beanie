// const host = 'https://server.john-shenk.com/beanieboo'
const host = 'http://localhost:3001'


export const login = async (user) => {
  try {
    const resp = await fetch(`${host}/login`, {
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

export const all = async (token) => {
  try {
    const resp = await fetch(`${host}/beanies`, {
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

export const updateWantList = async (user) => {
  try {
    const resp = await fetch(`${host}/user/wantlist`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
        'token': user.token
      }
    });
    const u = await resp.json();
    console.log()
    if (u.error) return {error: u.error};
    return u;
  } catch (err) {
    return {error: err};
  }
};

export const updateMyBeanies = async (user) => {
  try {
    const resp = await fetch(`${host}/user/beanies`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
        'token': user.token
      }
    });
    const u = await resp.json();
    console.log()
    if (u.error) return {error: u.error};
    return u;
  } catch (err) {
    return {error: err};
  }
};

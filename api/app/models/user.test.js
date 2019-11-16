var expect  = require('chai').expect;
var User = require('./user');


describe.only('User', () => {
  const user = new User('bobby');
  user.password = 'test';
  user.email = 'john_shenk@hotmail.com';

  it('creates', async() => {
    const u = await user.create();
    expect(u.email).to.equal('john_shenk@hotmail.com')
  });

  it('logins', async() => {
    const u = await user.login();
    expect(u).to.deep.equal({username: 'bobby', password: 'test', email: 'john_shenk@hotmail.com', beanies: [], wantlist: [], admin: false});
  });

  it('updates beanies', async() => {
    user.beanies = ['tundra'];
    const u = await user.updateBeanies();
    expect(u).to.deep.equal({username: 'bobby', email: 'john_shenk@hotmail.com', beanies: ['tundra'], wantlist: [], password: null, admin: false});
  });

  it('updates wantlist', async() => {
    user.wantlist = ['foobar'];
    const u = await user.updateWantlist();
    expect(u).to.deep.equal({username: 'bobby', email: 'john_shenk@hotmail.com', beanies: ['tundra'], wantlist: ['foobar'], password: null, admin: false});
  });

  it('gets', async() => {
    const u = await user.get();
    expect(u.username).to.equal('bobby');
    expect(u.password).to.be.null;
    expect(u.beanies.length).to.equal(1)
  });

  it.skip('resetsPassword', async() => {
    await user.resetPassword()
  });

  it('deletes', async() => {
    const u = await user.delete();
    expect(u).to.deep.equal({});
  });
}).timeout(5000);

describe('static' , () => {
  it('creates', () => {
    const p = User.randomPassword()
    console.log(p)
  });
});

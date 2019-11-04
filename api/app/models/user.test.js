var expect  = require('chai').expect;
var User = require('./user');


describe('User', () => {
  const user = new User('bobby');
  user.password = 'test';

  it('creates', async() => {
    const u = await user.create();
    expect(u).to.deep.equal({});
  });

  it('logins', async() => {
    const u = await user.login();
    expect(u).to.deep.equal({username: 'bobby', password: 'test', beanies: [], wantlist: [], admin: false});
  });

  it('updates beanies', async() => {
    user.beanies = ['tundra'];
    const u = await user.updateBeanies();
    expect(u).to.deep.equal({username: 'bobby', beanies: ['tundra'], wantlist: [], password: null, admin: false});
  });

  it('updates wantlist', async() => {
    user.wantlist = ['foobar'];
    const u = await user.updateWantlist();
    expect(u).to.deep.equal({username: 'bobby', beanies: ['tundra'], wantlist: ['foobar'], password: null, admin: false});
  });

  it('gets', async() => {
    const u = await user.get();
    expect(u.username).to.equal('bobby');
    expect(u.password).to.be.null;
    expect(u.beanies.length).to.equal(1)
  });

  it('deletes', async() => {
    const u = await user.delete();
    expect(u).to.deep.equal({});
  });
});

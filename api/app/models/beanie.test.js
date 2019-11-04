var expect  = require('chai').expect;
var Beanie = require('./beanie');


describe.only('Beanie', () => {
  const beanie = new Beanie('bobby')

  it('creates', async() => {
    const b = await beanie.create();
    expect(b).to.deep.equal({});
  });

  it('updates', () => {
    beanie.image = '/image';
    beanie.upsert();
  })

  it('gets', async() => {
    const b = await beanie.get();
    expect(b.name).to.equal('bobby');
    expect(b.image).to.equal('/image');
  });

  it('deletes', async() => {
    const b = await beanie.delete();
    expect(b).to.deep.equal({});
  });
});

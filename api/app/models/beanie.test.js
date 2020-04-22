var expect  = require('chai').expect;
var Beanie = require('./beanie');

describe('Beanie', () => {
  const beanie = new Beanie('bobby')
  beanie.family = 'Test'

  it('creates', async() => {
    const b = await beanie.create();
    expect(b).to.deep.equal({});
  });

  it('updates', () => {
    beanie.image = '/image';
    beanie.upsert();
  });

  it('gets', async() => {
    const b = await beanie.get();
    expect(b.name).to.equal('bobby');
    // expect(b.image).to.equal('/image');
  });

  it('deletes', async() => {
    const b = await beanie.delete();
    expect(b).to.deep.equal({});
  });
});

describe.only('image conversion', () => {
  let beanie = new Beanie('test');
  let b;
  it('gets', async () => {
    b = await beanie.get();
    expect(b.image).not.to.equal('');
  });

  it('creates thumbnail', async () => {
    beanie.image = "http://beanieboofanclub.org/wp-content/uploads/participants-database/anabelle-october-1.jpeg";
    beanie.family = 'Beanie Boos';
    await beanie.createThumbnail();
    expect(beanie.thumbnail).not.to.equal('');
  });
});

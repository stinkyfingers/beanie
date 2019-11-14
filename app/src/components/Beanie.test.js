import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Beanie from './Beanie';
import UserContext from '../UserContext';

describe('Beanie', () => {
  const userState = {
    user: {
      token: '123',
      isAdmin: false
    }
  };
  const beanie = {
    animal: "Bear",
    birthday: "December 23, 1999",
    exclusiveTo: "State of Tennessee",
    family: "Beanie Babies",
    height: "8.75 inches",
    image: "http://www.tycollector.com/beanies/bb-images/tennessee-40226.jpg",
    introDate: null,
    length: null,
    name: "Tennessee",
    number: "40226",
    retireDate: "May 23, 1999",
    st: null,
    tt: null,
    variety: "&nbsp;"
  }
  it('renders', async() => {
    const {container, findByDisplayValue} = render(<UserContext.Provider value={userState}><Beanie beanie={beanie} /></UserContext.Provider>);
    expect(await findByDisplayValue('Tennessee')).toBeDefined();
    expect(await findByDisplayValue('1999-12-23')).toBeDefined();
    expect(await findByDisplayValue('1999-05-23')).toBeDefined();
  });
  it.only('can be updated', async() => {
    const adminUserState = {
      user: {
        token: '123',
        isAdmin: true
      }
    };
    const {container, findByTestId, debug} = render(<UserContext.Provider value={adminUserState}><Beanie beanie={beanie} /></UserContext.Provider>);
    const el = await findByTestId('birthday')
    expect(el).toBeDefined();
    await fireEvent.change(el, {
      target: {value: '2002-02-02'}
    });
    const newBirthday = (await findByTestId('birthday')).value;
    // expect(newBirthday).toEqual('2002-02-02')
    debug()
  });
});

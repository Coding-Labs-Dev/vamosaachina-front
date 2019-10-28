import React, { useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Main from './pages/Main';
import Checkout from './pages/Checkout';

export default function Routes() {
  const [email, setEmail] = useState('');

  function callback(value) {
    setEmail(value);
  }

  return (
    <BrowserRouter>
      <Route exact path="/" render={() => <Main callback={callback} />} />
      <Route
        exact
        path="/inscricao"
        render={() => <Checkout email={email} />}
      />
    </BrowserRouter>
  );
}

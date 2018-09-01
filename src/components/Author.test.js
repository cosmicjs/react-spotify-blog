import React from 'react';
import ReactDOM from 'react-dom';
import Author from './Author';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Author />, div);
  ReactDOM.unmountComponentAtNode(div);
});

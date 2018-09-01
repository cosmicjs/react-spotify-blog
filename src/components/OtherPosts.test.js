import React from 'react';
import ReactDOM from 'react-dom';
import OtherPosts from './OtherPosts';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<OtherPosts />, div);
  ReactDOM.unmountComponentAtNode(div);
});

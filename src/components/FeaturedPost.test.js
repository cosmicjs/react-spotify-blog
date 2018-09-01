import React from 'react';
import ReactDOM from 'react-dom';
import FeaturedPost from './FeaturedPost';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FeaturedPost />, div);
  ReactDOM.unmountComponentAtNode(div);
});

import React from 'react';
import ReactDOM from 'react-dom';
import PlaylistChooser from './PlaylistChooser';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PlaylistChooser />, div);
  ReactDOM.unmountComponentAtNode(div);
});

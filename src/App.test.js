import App, {LoginScreen} from './App';
import React from 'react';
import { render, screen } from '@testing-library/react';

describe('App', () => {
    test('renders app header', () => {
      const { container } = render(<App />);
      const appHeader = container.querySelector('div>div.App>App-header');
      expect(appHeader).toBeDefined();
    });
});

describe('LoginScreen', () => {
    test('renders log in link', () => {
      render(<LoginScreen />);
      const linkElement = screen.getByText(/Log In With Twitch/i);
      expect(linkElement).toBeInTheDocument();
    });
});

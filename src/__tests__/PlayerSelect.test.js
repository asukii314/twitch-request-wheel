import PlayerSelect from '../PlayerSelect';
import React from 'react';
import { render, screen } from '@testing-library/react';

describe('PlayerSelect', () => {
    test('renders component', () => {
        let props = {};
        render(<PlayerSelect {...props} />);
        const element = screen.getByText(/Start Game/i);
        expect(element).toBeInTheDocument();
    });
});

import PlayerSelectModal from '../PlayerSelectModal';
import React from 'react';
import { render, screen } from '@testing-library/react';

describe('PlayerSelectModal', () => {
    test('renders component', () => {
        let props = {};
        render(<PlayerSelectModal {...props} />);
        const element = screen.getByText(/Start Game/i);
        expect(element).toBeInTheDocument();
    });
});

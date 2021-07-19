import GameRequest from './GameRequest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

describe('GameRequest', () => {
    test('renders component', async () => {
        let props = {
            gameName: 'Quiplash',
            metadata: {
                chosen: false,
                locked: false,
                time: Date.now()-300,
                username: 'Sir Goosewell'
            }
        };
        render(<GameRequest {...props} />);
        await waitFor(() => screen.getByText(/Quiplash/i));
        const element = screen.getByText(/Quiplash/i);
        expect(element).toBeInTheDocument();
    });
});

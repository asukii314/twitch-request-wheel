import JackboxGameList from './JackboxGameList';
import yamlGameList from './JackboxGames.yaml';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import fetch from 'node-fetch';
jest.mock('node-fetch');

describe('JackboxGameList', () => {
    test('renders component with yaml content', async () => {
        fetch.mockImplementation(() => {
            return Promise.resolve({
                text: () => Promise.resolve(yamlGameList),
            })
        });

        let props = {};
        render(<JackboxGameList {...props} />);

        await waitFor(() => screen.getByText(/you don't know jack: 2015/i));
        expect(screen.getByText(/you don't know jack: 2015/i)).toBeInTheDocument();
    });
});

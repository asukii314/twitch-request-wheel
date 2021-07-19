import Sidebar from './Sidebar';
import React from 'react';
import { render, screen } from '@testing-library/react';

describe('Sidebar', () => {
    test('renders page', () => {
        let props = {
            history: [],
            nextGameIdx: 0,
            changeNextGameIdx: ()=>{},
            moveNextGameFwd: ()=>{},
            moveNextGameBack: ()=>{},
            togglePlayerSelect: ()=>{},
            requestMode: 'game',    // valid responses: 'seat', 'game'
        }
        render(<Sidebar {...props} />);
        const headerUpNext = screen.getByText(/Up Next:/i);
        expect(headerUpNext).toBeInTheDocument();
    });
});

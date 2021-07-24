import MainScreen from '../MainScreen';
import React from 'react';
import {render, screen} from '@testing-library/react';

jest.mock('react-wheel-of-prizes', () => {
    return {
        __esModule: true,
        default: () => {
            return <></>;
        },
        WheelComponent: 'WheelComponent'
    };
});

describe('MainScreen', () => {
    test('renders page', () => {
        let props = {
            access_token: 'foo',
            channel: 'sirgoosewell',
            modList: [],
            onLogout: jest.fn()
        };
        render(<MainScreen {...props}/>);
        expect(screen.getByText(/OPEN SEAT REQUESTS/i)).toBeInTheDocument();
    });
});

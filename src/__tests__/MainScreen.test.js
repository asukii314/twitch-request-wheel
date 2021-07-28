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
        let {container} = render(<MainScreen {...props}/>);
        expect(container).toMatchSnapshot();
        expect(screen.getByText(/OPEN SEAT REQUESTS/i)).toBeInTheDocument();
    });
});

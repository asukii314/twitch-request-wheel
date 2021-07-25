import {AuthenticatedApp} from '../AuthenticatedApp';
import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('../JackboxGameList', () => {
    return {
        __esModule: true,
        default: () => (<>JackboxGameList</>),
        JackboxGameList: 'JackboxGameList'
    };
});
jest.mock('../MainScreen', () => {
    return {
        __esModule: true,
        default: () => (<> MainScreen </>),
        MainScreen: 'MainScreen'
    };
});

describe('AuthenticatedApp', () => {
    // TODO: fix the following error from AuthenticatedApp (when importing the default class):
    // Error: Invariant failed: You should not use <withRouter(AuthenticatedApp) /> outside a <Router>
    test('render page', async () => {
        let props = {
            failed_login: false,
            location: {
                pathname: '/',
            },
            username: 'dewinblack'
        };
        let {container} = render(<AuthenticatedApp {...props} />);
        expect(container.querySelector('div > div')).toBeDefined();
    });
    test('render gamelist', () => {
        let props = {
            location: {
                pathname: '/gamelist',
            },
            failed_login: false
        };
        render(<AuthenticatedApp {...props} />);
        expect(screen.getByText(/JackboxGameList/i)).toBeDefined();
    });
});

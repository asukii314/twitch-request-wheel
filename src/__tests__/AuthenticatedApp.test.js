import {AuthenticatedApp} from '../AuthenticatedApp';
import {createRenderer} from 'react-test-renderer/shallow';
import MainScreen from '../MainScreen';
import React from 'react';
import {Redirect} from "react-router-dom";
import {render} from '@testing-library/react';

jest.mock('../MainScreen');
jest.mock('react-router-dom', () => {
    const reactRouterDom = jest.requireActual('react-router-dom');
    return {
        ...reactRouterDom,
        Redirect: () => () => (<div>React Tooltip Mock</div>)
    };
});

describe('AuthenticatedApp', () => {
    // TODO: fix the following error from AuthenticatedApp (when importing the default class):
    // Error: Invariant failed: You should not use <withRouter(AuthenticatedApp) /> outside a <Router>
    let props = {
    	history: {
    		length: 3,
    		action: 'POP',
    		location: {
    			pathname: '/',
    			search: '?code=foobar&scope=chat:read chat:edit moderation:read',
    			hash: ""
    		}
    	},
    	location: {
    		pathname: '/',
    		search: '?code=foobar&scope=chat:read chat:edit moderation:read',
    		hash: ""
    	},
    	match: {
    		path: '/',
    		url: '/',
    		isExact: true,
    		params: {}
    	}
    };
    test('render page', async () => {
        let {container} = render(<AuthenticatedApp {...props} />);
        expect(container).toMatchSnapshot();
        expect(container.querySelector('div > div')).toBeDefined();
    });
    test('render with MainScreen', () => {
        const shallowRenderer = createRenderer();
        shallowRenderer.render(<AuthenticatedApp {...props} />);
        let instance = shallowRenderer.getMountedInstance();
        instance.setState({
            access_token: 'yadayadayada',
            failed_login: false,
            modList: [],
            username: 'sirgoosewell'
        });
        let component = shallowRenderer.getRenderOutput();
        expect(component.props.children.type).toBe(MainScreen);
        expect(component).toMatchSnapshot();
        shallowRenderer.unmount();
    });
    test('render with Redirect', () => {
        const shallowRenderer = createRenderer();
        shallowRenderer.render(<AuthenticatedApp {...props} />);
        let instance = shallowRenderer.getMountedInstance();
        instance.setState({
            access_token: null,
            failed_login: true,
            username: null
        });
        let component = shallowRenderer.getRenderOutput();
        expect(component.type).toBe(Redirect);
        expect(component).toMatchSnapshot();
        shallowRenderer.unmount();
    });
});

import {createRenderer} from 'react-test-renderer/shallow';
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
    const props = {
        access_token: 'foo',
        channel: 'sirgoosewell',
        modList: [],
        onLogout: jest.fn()
    };
    test('renders page', () => {
        let {container} = render(<MainScreen {...props} onLogout={null} />);
        expect(container).toMatchSnapshot();
        expect(screen.getByText(/OPEN SEAT REQUESTS/i)).toBeInTheDocument();
    });
    test('should render the game request screen', () => {
        let state = {
        	messages: {
        		'Survive The Internet (Party Pack 4)': {
        			name: 'Survive The Internet',
        			longName: 'Survive The Internet (Party Pack 4)',
        			partyPack: 'Party Pack 4',
        			'Min players': 3,
        			'Max players': 8,
        			Variants: ['survive', 'survive the internet', 'sti'],
        			username: 'dcpesses',
        			time: 1627509347466,
        			locked: false,
        			chosen: false
        		}
        	},
        	colors: ['#99b0fc', '#b4a7f2', '#beb4f7', '#cdc2f9', '#aec2f9', '#a4d6f9'],
        	counter: 1,
        	history: [],
        	nextGameIdx: 0,
        	showPlayerSelect: false
        };
        const shallowRenderer = createRenderer();
        shallowRenderer.render(<MainScreen {...props}/>);
        let instance = shallowRenderer.getMountedInstance();
        instance.setState(state);
        expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
        shallowRenderer.unmount();
    });
    test('should render the player selection screen', () => {
        let state = {
            messages: {
                'Survive The Internet (Party Pack 4)': {
                    name: 'Survive The Internet',
                    longName: 'Survive The Internet (Party Pack 4)',
                    partyPack: 'Party Pack 4',
                    'Min players': 3,
                    'Max players': 8,
                    Variants: ['survive', 'survive the internet', 'sti'],
                    username: 'dcpesses',
                    time: 1627509347466,
                    locked: false,
                    chosen: false
                }
            },
            colors: ['#99b0fc', '#b4a7f2', '#beb4f7', '#cdc2f9', '#aec2f9', '#a4d6f9'],
            counter: 1,
            history: [],
            nextGameIdx: 0,
            showPlayerSelect: true
        };
        const shallowRenderer = createRenderer();
        shallowRenderer.render(<MainScreen {...props}/>);
        let instance = shallowRenderer.getMountedInstance();
        instance.setState(state);
        expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
        shallowRenderer.unmount();
    });
});

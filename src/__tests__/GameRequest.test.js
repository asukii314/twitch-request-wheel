import {ActivityStatus} from '../ChatActivity';
import {createRenderer} from 'react-test-renderer/shallow';
import GameRequest from '../GameRequest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

// forces react-tooltip to reuse the same uuids
// to avoid breaking snapshots each time :P
jest.mock('crypto', () => ({
    randomBytes: (num: number) => new Array(num).fill(0),
}));

describe('GameRequest', () => {
    const propsQuip = {
        gameName: 'Quiplash',
        metadata: {
            chosen: true,
            locked: true,
            time: Date.now()-300000,
            username: 'Sir Goosewell'
        }
    };
    const propsSTI = {
    	gameName: 'Survive The Internet (Party Pack 4)',
    	metadata: {
    		name: 'Survive The Internet',
    		longName: 'Survive The Internet (Party Pack 4)',
    		partyPack: 'Party Pack 4',
    		'Min players': 3,
    		'Max players': 8,
    		Variants: ['survive', 'survive the internet', 'sti'],
    		username: 'dcpesses',
    		time: Date.now()-120000,
    		locked: false,
    		chosen: false
    	}
    };
    describe('getFormattedTimeDiff', () => {
        test('should return the expected response', async () => {
            let component = new GameRequest({
                metadata: {
                    chosen: true,
                    locked: true,
                    time: Date.now(),
                    username: 'Sir Goosewell'
                }
            });
            expect(component.getFormattedTimeDiff(Date.now())).toBe('just now');
            expect(component.getFormattedTimeDiff(Date.now()-(10 * 60000))).toBe('10 minutes ago');
            expect(component.getFormattedTimeDiff(Date.now()-(60 * 60000))).toBe('1 hour ago');
            expect(component.getFormattedTimeDiff(Date.now()-(24 * 60 * 60000))).toBe('1 day ago');
        });
    });
    describe('render', () => {
        test('should render component using quiplash data', async () => {
            let {container} = render(<GameRequest {...propsQuip} />);
            try {
                await waitFor(() => screen.getByText(/Quiplash/i));
                const element = screen.getByText(/Quiplash/i);
                expect(element).toBeInTheDocument();
            } catch (e) {
                throw e;
            }
            expect(container).toMatchSnapshot();
        });
        test('should render component using survive the internet data', () => {
            const shallowRenderer = createRenderer();
            shallowRenderer.render(<GameRequest {...propsSTI} />);
            let instance = shallowRenderer.getMountedInstance();
            instance.setState({
                activityStatus: ActivityStatus.ACTIVE,
                timeDiff: '2 minutes ago'
            });
            expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
            instance.setState({
                activityStatus: ActivityStatus.IDLE,
                timeDiff: '3 minutes ago'
            });
            expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
            instance.setState({
                activityStatus: ActivityStatus.DISCONNECTED,
                timeDiff: '4 minutes ago'
            });
            expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
            shallowRenderer.unmount();
        });
        test('should render component using survive the internet data and updated status info', async () => {
            let props = Object.assign({}, propsSTI, {
                getActivity: jest.fn()
                    .mockResolvedValueOnce(3)
                    .mockResolvedValueOnce(2)
                    .mockResolvedValueOnce(1),
                onDelete: jest.fn(),
                toggleLock: jest.fn()
            })
            const shallowRenderer = createRenderer();
            shallowRenderer.render(<GameRequest {...props} />);
            let instance = shallowRenderer.getMountedInstance();
            instance.setState({
                activityStatus: ActivityStatus.IDLE,
                timeDiff: '2 minutes ago'
            });
            let component = shallowRenderer.getRenderOutput();
            await component.props.children[1].props.onMouseEnter();
            expect(props.getActivity).toHaveBeenCalledTimes(1);

            // Get the children of the element div.options
            let optionsChildren = component.props.children[1].props.children.props.children[1].props.children;
            optionsChildren[0].props.onClick();
            optionsChildren[0].props.onClick();
            optionsChildren[1].props.onClick();
            expect(props.toggleLock).toHaveBeenCalledTimes(2);
            expect(props.onDelete).toHaveBeenCalledTimes(1);
            shallowRenderer.unmount();
        });
    });
});

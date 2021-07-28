import {ActivityStatus} from '../ChatActivity';
import {createRenderer} from 'react-test-renderer/shallow';
import GameRequest from '../GameRequest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

jest.mock('react-tooltip', () => () => (<div>React Tooltip Mock</div>));

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
            await waitFor(() => screen.getByText(/Quiplash/i));
            const element = screen.getByText(/Quiplash/i);
            expect(element).toBeInTheDocument();
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
                    .mockImplementationOnce(async () => 3)
                    .mockImplementationOnce(async () => 2)
                    .mockImplementationOnce(async () => 1),
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
            component.props.children[1].props.onMouseEnter();
            expect(props.getActivity).toHaveBeenCalledTimes(1);

            let optionsChildren = component.props.children[1].props.children.props.children[1].props.children;
            optionsChildren[0].props.onClick();
            optionsChildren[0].props.onClick();
            optionsChildren[1].props.onClick();
            expect(props.toggleLock).toHaveBeenCalledTimes(2);
            expect(props.onDelete).toHaveBeenCalledTimes(1);
            shallowRenderer.unmount();
        });
        // test('should render component witht data and test time formatting', async () => {
        //     let props = Object.assign({}, propsSTI, {
        //         getActivity: jest.fn()
        //             .mockImplementationOnce(async () => 3)
        //             .mockImplementationOnce(async () => 2)
        //             .mockImplementationOnce(async () => 1),
        //         metadata: Object.assign({}, propsSTI.metadata, {
        //             time: Date.now()
        //         }),
        //         onDelete: jest.fn(),
        //         toggleLock: jest.fn()
        //     })
        //     const shallowRenderer = createRenderer();
        //     shallowRenderer.render(<GameRequest {...props} />);
        //     let instance = shallowRenderer.getMountedInstance();
        //     console.log('instance:', instance);
        //     // jest.spyOn(instance, 'setState').mockImplementation(() => {});
        //     let component = shallowRenderer.getRenderOutput();
        //     component.props.children[1].props.onMouseEnter();
        //     console.log('instance.state:', instance.state);
        //     component = shallowRenderer.getRenderOutput()
        //     instance.props.metadata.time = Date.now()-30000;
        //     component.props.children[1].props.onMouseEnter();
        //     console.log('instance.state:', instance.state);
        //
        //     console.log('props.getActivity.mock.calls:', props.getActivity.mock.calls);
        //     // console.log('instance.setState.mock.calls:', instance.setState.mock.calls);
        //     expect(props.getActivity).toHaveBeenCalledTimes(2);
        //     // expect(instance.setState).toHaveBeenCalledTimes(2);
        //
        //     shallowRenderer.unmount();
        // });
    });
});

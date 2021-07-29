import {ActivityStatus} from '../ChatActivity';
import {createRenderer} from 'react-test-renderer/shallow';
import MainScreen from '../MainScreen';
import React from 'react';

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

    describe('onWheelSpun', () => {
        const state = {
            messages: {
                'Trivia Murder Party 2': {
                    name: 'Trivia Murder Party 2',
                    longName: 'Trivia Murder Party 2',
                    username: 'aurora88877',
                    locked: false
                },
                'Quiplash 3': {
                    name: 'Quiplash 3',
                    longName: 'Quiplash 3',
                    username: 'johnell75',
                    locked: false
                },
                'Survive The Internet (Party Pack 4)': {
                    name: 'Survive The Internet',
                    longName: 'Survive The Internet (Party Pack 4)',
                    partyPack: 'Party Pack 4',
                    'Min players': 3,
                    'Max players': 8,
                    Variants: ['survive', 'survive the internet', 'sti'],
                    username: 'aurora88877',
                    time: 1627509347466,
                    locked: true,
                    chosen: false
                }
            },
            colors: ['#99b0fc', '#b4a7f2', '#beb4f7', '#cdc2f9', '#aec2f9', '#a4d6f9'],
            counter: 1,
            history: [],
            nextGameIdx: 0,
            showPlayerSelect: false
        };

        test('should respond to ActivityStatus when game found in state', async () => {
            jest.useFakeTimers();

            const component = new MainScreen(props);
            component.state = state;
            component.messageHandler = {
                sendMessage: jest.fn().mockImplementation((msg) => {
                    return Promise.resolve(msg);
                })
            };

            jest.spyOn(component.messageHandler, 'sendMessage').mockImplementation(() => {})
            jest.spyOn(component.chatActivity, 'getStatusPromise')
                .mockResolvedValueOnce(ActivityStatus.ACTIVE)
                .mockResolvedValueOnce(ActivityStatus.IDLE)
                .mockResolvedValueOnce(ActivityStatus.DISCONNECTED);
            jest.spyOn(component, 'addGameToQueue').mockImplementation(() => {});
            // jest.spyOn(component, 'removeGame').mockImplementation(() => {});
            jest.spyOn(component, 'setState').mockImplementation(() => {});

            await component.onWheelSpun('Trivia Murder Party 2');
            await component.onWheelSpun('Quiplash 3');
            await component.onWheelSpun('Survive The Internet (Party Pack 4)');
            await component.onWheelSpun('Quiplash 2');

            jest.advanceTimersByTime(5000);
            jest.clearAllTimers();

            expect(setTimeout).toHaveBeenCalledTimes(2);
            // expect(component.removeGame).toHaveBeenCalledTimes(2);
            expect(component.setState).toHaveBeenCalledTimes(2);
            expect(component.setState.mock.calls[0][0]()).toEqual({
                messages : {
                    'Quiplash 3': {
                        name: 'Quiplash 3',
                        longName: 'Quiplash 3',
                        username: 'johnell75',
                        locked: false
                    },
                    'Survive The Internet (Party Pack 4)': {
                        name: 'Survive The Internet',
                        longName: 'Survive The Internet (Party Pack 4)',
                        partyPack: 'Party Pack 4',
                        'Min players': 3,
                        'Max players': 8,
                        Variants: ['survive', 'survive the internet', 'sti'],
                        username: 'aurora88877',
                        time: 1627509347466,
                        locked: true,
                        chosen: false
                    }
                },
                counter: 2
            });

            expect(component.chatActivity.getStatusPromise).toHaveBeenCalledTimes(3);

            expect(component.messageHandler.sendMessage).toHaveBeenCalledTimes(3);
            expect(component.messageHandler.sendMessage).toHaveBeenNthCalledWith(1,
                expect.stringContaining('/me @aurora88877, good news')
            );
            expect(component.messageHandler.sendMessage).toHaveBeenNthCalledWith(2,
                expect.stringContaining('/me @johnell75, good news')
            );
            expect(component.messageHandler.sendMessage).toHaveBeenNthCalledWith(3,
                expect.stringContaining('/me Survive The Internet just won the spin')
            );
        });
    });
    describe('setMessageHandlerRef', () => {
        test('should set messageHandler instance', () => {
            const component = new MainScreen(props);
            let ref = React.createRef();
            component.setMessageHandlerRef(ref);
            expect(component.messageHandler).toBe(ref);
        });
    });
    describe('setPlayerSelectRef', () => {
        test('should set playerSelector instance', () => {
            const component = new MainScreen(props);
            let ref = React.createRef();
            component.setPlayerSelectRef(ref);
            expect(component.playerSelector).toBe(ref);
        });
    });
    describe('render', () => {
        test('renders page', () => {
            const shallowRenderer = createRenderer();
            shallowRenderer.render(<MainScreen/>);
            let component = shallowRenderer.getRenderOutput();
            expect(component.type).toBe('div');
            shallowRenderer.unmount();
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
            let component = shallowRenderer.getRenderOutput();
            expect(component).toMatchSnapshot();
            // console.log(component.props.children.filter(p => p.type === 'button'));
            let logoutBtn = component.props.children.find(p => p.type === 'button');
            logoutBtn.props.onClick();
            // userEvent.click(logoutBtn);
            expect(props.onLogout).toHaveBeenCalledTimes(1);
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
            expect(instance.playerSelector).toBeDefined();
            shallowRenderer.unmount();
        });
    });
});

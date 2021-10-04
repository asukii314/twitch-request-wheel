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

    describe('changeNextGameIdx', () => {
        test('should call setState', () => {
            const component = new MainScreen(props);
            component.state = Object.assign({}, state, {
                history: [{
                    'Blather \'Round': {
                        name: 'Blather \'Round',
                        longName: 'Blather \'Round',
                        username: 'dcpesses',
                        locked: false
                    }
                }]
            });
            jest.spyOn(component, 'setState').mockImplementation(()=>{});

            expect(component.changeNextGameIdx()).toBeTruthy();
            expect(component.setState.mock.calls[0][0](component.state)).toEqual({
                ...component.state,
                nextGameIdx: 1
            });
        });
        test('should return false', () => {
            const component = new MainScreen(props);

            expect(component.changeNextGameIdx(3)).toBeFalsy();
            expect(component.changeNextGameIdx(-3)).toBeFalsy();
        });
    });

    describe('changeGameOrder', () => {
        test('should call setState', () => {
            const component = new MainScreen(props);
            jest.spyOn(component, 'setState').mockImplementation(()=>{});

            expect(component.changeGameOrder([{}], 1)).toBeTruthy();
            expect(component.setState).toHaveBeenCalledWith({
                history: [{}],
                nextGameIdx: 1
            });
        });
        test('should return false', () => {
            const component = new MainScreen(props);

            expect(component.changeGameOrder([{}], 2)).toBeFalsy();
        });
    });

    describe('moveNextGameFwd', () => {
        test('should call changeNextGameIdx without passing any values', () => {
            const component = new MainScreen(props);
            jest.spyOn(component, 'changeNextGameIdx').mockImplementation(()=>{});
            component.moveNextGameFwd();

            expect(component.changeNextGameIdx).toHaveBeenCalledTimes(1);
            expect(component.changeNextGameIdx).toHaveBeenCalledWith();
        });
    });

    describe('moveNextGameBack', () => {
        test('should call changeNextGameIdx and pass the value -1', () => {
            const component = new MainScreen(props);
            jest.spyOn(component, 'changeNextGameIdx').mockImplementation(()=>{});
            component.moveNextGameBack();

            expect(component.changeNextGameIdx).toHaveBeenCalledTimes(1);
            expect(component.changeNextGameIdx).toHaveBeenCalledWith(-1);
        });
    });

    describe('addGameRequest', () => {
        test('should call setState and update messages with the new game', () => {
            const component = new MainScreen(props);
            jest.spyOn(component, 'setState').mockImplementation(()=>{});
            let gameObj = {
                name: 'Blather \'Round',
                longName: 'Blather \'Round (Party Pack 7)'
            };
            component.addGameRequest(gameObj, 'dcpesses');

            expect(component.setState).toHaveBeenCalledTimes(1);
            let nextState = component.setState.mock.calls[0][0](component.state);
            expect(Object.keys(nextState.messages).length).toBe(Object.keys(component.state.messages).length + 1);
            expect(nextState.messages['Blather \'Round (Party Pack 7)']).toBeDefined();
            expect(nextState.counter).toBe(component.state.counter + 1);
        });
    });

    describe('toggleLock', () => {
        test('should toggle the locked value of the specified game', () => {
            const component = new MainScreen(props);
            component.state = Object.assign({}, state);
            component.state.messages['Trivia Murder Party 2'].locked = false;
            jest.spyOn(component, 'setState').mockImplementation(()=>{});
            component.toggleLock('Trivia Murder Party 2');

            expect(component.setState).toHaveBeenCalledTimes(1);
            let nextState = component.setState.mock.calls[0][0](component.state);
            expect(nextState.messages['Trivia Murder Party 2'].locked).toBeTruthy();
        });
    });

    describe('setNextGame', () => {
        let history = [{
            name: 'Quiplash 3',
            longName: 'Quiplash 3',
            username: 'johnell75',
            locked: false
        }, {
            name: 'Survive The Internet',
            longName: 'Survive The Internet (Party Pack 4)',
            partyPack: 'Party Pack 4',
            'Min players': 3,
            'Max players': 8,
            Variants: ['survive', 'survive the internet', 'sti'],
            username: 'aurora88877',
            time: 1627509347466,
            override: true,
            chosen: false
        }, {
            name: 'Trivia Murder Party 2',
            longName: 'Trivia Murder Party 2',
            username: 'aurora88877',
            locked: false
        }];
        test('should insert the game at the next up position and after any manually inserted games', () => {
            const component = new MainScreen(props);
            component.state = Object.assign({}, state, {
                history,
                nextGameIdx: 1
            });
            jest.spyOn(component, 'setState').mockImplementation(()=>{});
            let gameObj = {
                name: 'Blather \'Round',
                longName: 'Blather \'Round (Party Pack 7)'
            };
            component.setNextGame(gameObj);
            expect(component.setState).toHaveBeenCalledTimes(1);
            let nextState = component.setState.mock.calls[0][0](component.state);
            expect(nextState.history.length).toBe(component.state.history.length + 1);
            expect(nextState.history[2].name).toBe('Blather \'Round');
        });
    });


    describe('addGameToQueue', () => {
        test('should update history with game', () => {
            const component = new MainScreen(props);
            jest.spyOn(component, 'setState').mockImplementation(()=>{});
            let gameObj = {
                name: 'Quiplash 3',
                longName: 'Quiplash 3 (Party Pack 7)'
            };
            component.addGameToQueue(gameObj, 'dcpesses');

            expect(component.setState).toHaveBeenCalledTimes(1);
            let nextState = component.setState.mock.calls[0][0](component.state);
            expect(nextState.history.length).toBe(component.state.history.length + 1);
            expect(nextState.messages['Quiplash 3 (Party Pack 7)'].chosen).toBeTruthy();
            expect(nextState.history[nextState.history.length-1].name).toBe('Quiplash 3');
            expect(nextState.history[nextState.history.length-1].override).toBeFalsy();
        });
    });


    describe('onWheelSpun', () => {
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

    describe('onMessage', () => {
        test('should call chatActivity.updateLastMessageTime with the user', () => {
            const component = new MainScreen(props);
            jest.spyOn(component.chatActivity, 'updateLastMessageTime').mockImplementation(()=>{});

            component.onMessage('CrunchyButtMD');

            expect(component.chatActivity.updateLastMessageTime).toHaveBeenCalledTimes(1);
        });
    });

    describe('togglePlayerSelect', () => {
        test('should toggle the value of state.showPlayerSelect', () => {
            const component = new MainScreen(props);
            jest.spyOn(component, 'setState').mockImplementation(()=>{});
            component.state.showPlayerSelect = true;
            component.togglePlayerSelect();

            expect(component.setState).toHaveBeenCalledTimes(1);
            expect(component.setState.mock.calls[0][0](component.state)).toEqual({
                ...component.state,
                showPlayerSelect: false
            });
        });
    });

    describe('routePlayRequest', () => {
        test('should send a message to the user that signups are closed', () => {
            const component = new MainScreen(props);
            component.state.showPlayerSelect = false;
            // component.setPlayerSelectRef({handleNewPlayerRequest: jest.fn()});
            component.setMessageHandlerRef({sendMessage: jest.fn()});

            component.routePlayRequest('iniquity_stepbro', {});

            // expect(component.playerSelector.handleNewPlayerRequest).toHaveBeenCalledTimes(1);
            expect(component.messageHandler.sendMessage).toHaveBeenCalledTimes(1);
            expect(component.messageHandler.sendMessage.mock.calls[0][0]).toEqual(
                expect.stringContaining('sign-ups are currently closed'),
            );
        });
        test('should call handleNewPlayerRequest with a priority seat but not send a message to the user', () => {
            const component = new MainScreen(props);
            component.state.showPlayerSelect = true;
            component.setPlayerSelectRef({handleNewPlayerRequest: jest.fn()});
            component.setMessageHandlerRef({sendMessage: jest.fn()});

            component.routePlayRequest('iniquity_stepbro', {
                sendConfirmationMsg: false,
                isPrioritySeat: true
            });

            expect(component.playerSelector.handleNewPlayerRequest).toHaveBeenCalledTimes(1);
            expect(component.messageHandler.sendMessage).toHaveBeenCalledTimes(0);
        });
    });

    describe('routeLeaveRequest', () => {
        test('should call playerSelector.removeUser when available', () => {
            const component = new MainScreen(props);
            component.routeLeaveRequest();

            component.setPlayerSelectRef({removeUser: jest.fn()});
            component.routeLeaveRequest();
            expect(component.playerSelector.removeUser).toHaveBeenCalledTimes(1);
        });
    });

    describe('routeOpenQueueRequest', () => {
        test('should call playerSelector.openQueue when available', () => {
            const component = new MainScreen(props);
            jest.spyOn(component, 'setState').mockImplementation(()=>{});
            component.routeOpenQueueRequest();

            component.setPlayerSelectRef({openQueue: jest.fn()});
            component.routeOpenQueueRequest();
            expect(component.playerSelector.openQueue).toHaveBeenCalledTimes(1);

            expect(component.setState.mock.calls[1][0](component.state)).toEqual({
                ...component.state,
                showPlayerSelect: true
            });
        });
    });

    describe('routeCloseQueueRequest', () => {
        test('should call playerSelector.closeQueue when available', () => {
            const component = new MainScreen(props);
            component.routeCloseQueueRequest();

            component.setPlayerSelectRef({closeQueue: jest.fn()});
            component.routeCloseQueueRequest();
            expect(component.playerSelector.closeQueue).toHaveBeenCalledTimes(1);
        });
    });

    describe('routeClearQueueRequest', () => {
        test('should call playerSelector.clearQueue when available', () => {
            const component = new MainScreen(props);
            component.routeClearQueueRequest();

            component.setPlayerSelectRef({clearQueue: jest.fn()});
            component.routeClearQueueRequest();
            expect(component.playerSelector.clearQueue).toHaveBeenCalledTimes(1);
        });
    });

    describe('startGame', () => {
        test('should call moveNextGameFwd only in the Player Select view', () => {
            const component = new MainScreen(props);
            component.state = Object.assign({}, state, {
                showPlayerSelect: true
            });
            jest.spyOn(component, 'moveNextGameFwd').mockImplementation(() => {});

            expect(component.startGame()).toBeTruthy();

            component.state.showPlayerSelect = false;
            expect(component.startGame()).toBeFalsy();

            expect(component.moveNextGameFwd).toHaveBeenCalledTimes(1);
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
            let logoutBtn = component.props.children.find(p => p.type === 'button');
            logoutBtn.props.onClick();
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

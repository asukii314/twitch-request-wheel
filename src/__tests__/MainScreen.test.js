import {ActivityStatus} from '../ChatActivity';
import {createRenderer} from 'react-test-renderer/shallow';
import MainScreen from '../landing/MainScreen';
import React from 'react';

// jest.mock('react-wheel-of-prizes', () => {
//     return {
//         __esModule: true,
//         default: () => {
//             return <></>;
//         },
//         WheelComponent: 'WheelComponent'
//     };
// });

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

    describe('clearModal', () => {
        test('should clear the gameSelected object used for the modal', () => {
            const component = new MainScreen(props);
            component.state.gameSelected = {
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
            };
            jest.spyOn(component, 'setState').mockImplementation(()=>{});
            component.clearModal();
            expect(component.setState).toHaveBeenCalledTimes(1);
        });
    });

    describe('getOptionsDebugMenu', () => {
        let component;
        let debugMenuItems;
        beforeEach(()=>{
            component = new MainScreen(props);
            component.state.logUserMessages = false;
            jest.spyOn(console, 'log').mockImplementation(()=>{});
            jest.spyOn(component, 'toggleUserMessageLogging').mockImplementation(()=>{});
            jest.spyOn(component, 'setState').mockImplementation(( obj, cb=()=>{} ) => cb());
            debugMenuItems = component.getOptionsDebugMenu();
        });
        afterEach(()=>{
        });
        test('should return an array of menu items', () => {
            expect(debugMenuItems.length).toEqual(4);
        });
        test('should load mock game requests', () => {
            debugMenuItems[0].onClick();
            expect(debugMenuItems[0].label).toBe('Load Mock Game Requests');
            expect(component.setState).toHaveBeenCalledTimes(1);
        });
        test('should load mock game and player requests', () => {
            debugMenuItems[1].onClick();
            expect(debugMenuItems[1].label).toBe('Load Mock Game & Player Requests');
            expect(component.setState).toHaveBeenCalledTimes(1);
        });
        test('should log debug environment', () => {
            debugMenuItems[2].onClick();
            expect(debugMenuItems[2].label).toBe('Log Debug Environment');
            expect(console.log).toHaveBeenCalledTimes(2);
            // expect(console.log).toHaveBeenCalledWith('toggleUserMessageLogging | new state: ', 'false');
        });
        test('should toggle user messaging logging', () => {
            debugMenuItems[3].onClick();
            expect(debugMenuItems[3].label).toBe('Toggle User Message Logging');
            expect(component.toggleUserMessageLogging).toHaveBeenCalledTimes(1);
        });
    });

    // describe('getOptionsDebugMenu', () => {
    //     let component;
    //     beforeEach(()=>{
    //     });
    //     afterEach(()=>{
    //     });
    //     test('should return an array of menu items', () => {
    //         const component = new MainScreen(props);
    //         component.state.logUserMessages = false;
    //         jest.spyOn(console, 'log').mockImplementation(()=>{});
    //         jest.spyOn(component, 'setState').mockImplementation(( obj, cb=()=>{} ) => cb());
    //         const debugMenuItems = component.getOptionsDebugMenu();
    //         debugMenuItems[0].onClick()
    //         expect(component.setState).toHaveBeenCalledTimes(1);
    //         expect(console.log).toHaveBeenCalledWith('toggleUserMessageLogging | new state: ', 'false');
    //     });
    // });

    describe('toggleUserMessageLogging', () => {
        test('should call setState and log the change to the console', () => {
            const component = new MainScreen(props);
            component.state.logUserMessages = false;
            jest.spyOn(console, 'log').mockImplementation(()=>{});
            jest.spyOn(component, 'setState').mockImplementation(( objOrFn, cb=()=>{} ) => {
                objOrFn(component.state);
                cb();
            });
            component.toggleUserMessageLogging();
            expect(component.setState).toHaveBeenCalledTimes(1);
            expect(console.log).toHaveBeenCalledWith('toggleUserMessageLogging | new state: ', 'false');
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
            jest.spyOn(component, 'clearModal').mockImplementation(() => {});

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
            expect(component.clearModal).toHaveBeenCalledTimes(2);
        });
    });

    describe('removeGame', () => {
        test('should remove the game specified from the messages array', () => {
            const component = new MainScreen(props);
            jest.spyOn(component, 'setState').mockImplementation(()=>{});
            component.state = {
                counter: 1,
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
                }
            };
            component.removeGame('Quiplash 3');

            expect(component.setState).toHaveBeenCalledTimes(1);
            expect(component.setState.mock.calls[0][0](component.state)).toEqual({
                ...component.state,
                counter: 2,
                messages: {
                    'Trivia Murder Party 2': {
                        name: 'Trivia Murder Party 2',
                        longName: 'Trivia Murder Party 2',
                        username: 'aurora88877',
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
                }
            });
        });
    });

    describe('removeSelectedGameFromHistory', () => {
        test('should return the game and remove it from the history state', () => {
            const component = new MainScreen(props);
            component.state.history = [
                'foo', 'bar', 'rino'
            ];
            jest.spyOn(component, 'setState').mockImplementation(()=>{});
            const output = component.removeSelectedGameFromHistory();
            expect(output).not.toBeFalsy();
            expect(component.setState).toHaveBeenCalledTimes(1);
            expect(component.setState).toHaveBeenCalledWith({
                history: ['bar', 'rino'],
                nextGameIdx: 0
            });
        });
        test('should return false if the selected game does not exist', () => {
            const component = new MainScreen(props);
            component.state.nextGameIdx = 1;
            jest.spyOn(component, 'setState').mockImplementation(()=>{});
            const output = component.removeSelectedGameFromHistory();
            expect(output).toBeFalsy();
            expect(component.setState).toHaveBeenCalledTimes(0);
        });
    });

    describe('onMessage', () => {
        test('should call chatActivity.updateLastMessageTime with the user and update state.userLookup', async() => {
            const component = new MainScreen(props);
            component.state.userLookup = {
                mockUser: {
                    'user-id': 'mockUserId',
                    username: 'mockUser'
                }
            };
            jest.spyOn(component.chatActivity, 'updateLastMessageTime').mockImplementation(()=>{});
            jest.spyOn(component, 'setState').mockImplementation(( obj, cb=()=>{} ) => cb());

            await component.onMessage('mock message', 'mockuser', {
                'user-id': 'mockUserId',
                username: 'mockUser'
            });

            expect(component.chatActivity.updateLastMessageTime).toHaveBeenCalledTimes(1);
            expect(component.setState).toHaveBeenCalledTimes(1);
        });
        test('should call chatActivity.updateLastMessageTime with the user without updating state.userLookup', () => {
            const component = new MainScreen(props);
            component.state.userLookup = {};
            jest.spyOn(component.chatActivity, 'updateLastMessageTime').mockImplementation(()=>{});
            jest.spyOn(component, 'setState').mockImplementation(( obj, cb=()=>{} ) => cb());

            component.onMessage('CrunchyButtMD');

            expect(component.chatActivity.updateLastMessageTime).toHaveBeenCalledTimes(1);
            expect(component.setState).toHaveBeenCalledTimes(0);
        });
    });


    describe('onUndoState', () => {
        test('should call playerSelector.onUndoState with value of state.undoState', async () => {
            const component = new MainScreen(props);
            component.state.showPlayerSelect = false;
            component.playerSelector = {
                onUndoState: jest.fn()
            };
            jest.spyOn(component, 'togglePlayerSelect').mockImplementation(()=>{});
            jest.spyOn(component, 'moveNextGameBack').mockImplementation(()=>{});
            jest.spyOn(component, 'setState').mockImplementation(( obj, cb=()=>{} ) => cb());

            component.onUndoState();
            expect(component.togglePlayerSelect).toHaveBeenCalledTimes(1);

            component.state.showPlayerSelect = true;
            component.onUndoState();

            expect(component.playerSelector.onUndoState).toHaveBeenCalledTimes(2);
            expect(component.togglePlayerSelect).toHaveBeenCalledTimes(1);
        });
    });

    describe('toggleAllowGameRequests', () => {
        test('should toggle the value of state.allowGameRequests', () => {
            const component = new MainScreen(props);
            jest.spyOn(component, 'setState').mockImplementation(()=>{});
            component.state.allowGameRequests = true;
            component.toggleAllowGameRequests();

            expect(component.setState).toHaveBeenCalledTimes(1);
            expect(component.setState.mock.calls[0][0](component.state)).toEqual({
                allowGameRequests: false
            });
        });
        test('should set state.allowGameRequests to argument value', () => {
            const component = new MainScreen(props);
            jest.spyOn(component, 'setState').mockImplementation(()=>{});
            component.state.allowGameRequests = false;
            component.toggleAllowGameRequests(false);

            expect(component.setState).toHaveBeenCalledTimes(1);
            expect(component.setState.mock.calls[0][0](component.state)).toEqual({
                allowGameRequests: false
            });
        });
    });

    describe('toggleOptionsMenu', () => {
        test('should toggle the value of state.showOptionsMenu', () => {
            const component = new MainScreen(props);
            jest.spyOn(component, 'setState').mockImplementation(()=>{});
            component.state.showOptionsMenu = true;
            component.toggleOptionsMenu();

            expect(component.setState).toHaveBeenCalledTimes(1);
            expect(component.setState.mock.calls[0][0](component.state)).toEqual({
                showOptionsMenu: false
            });
        });
    });

    describe('toggleOptionsModal', () => {
        test('should toggle the value of state.showOptionsModal', () => {
            const component = new MainScreen(props);
            jest.spyOn(component, 'setState').mockImplementation(()=>{});
            component.state.showOptionsModal = true;
            component.toggleOptionsModal();

            expect(component.setState).toHaveBeenCalledTimes(1);
            expect(component.setState.mock.calls[0][0](component.state)).toEqual({
                showOptionsModal: false
            });
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

    describe('showUndoAvailable', () => {
        test('should return true when available', () => {
            const component = new MainScreen(props);
            component.state = {
                ...component.state,
                history: [{
                    longName: 'mockLongName'
                }, {
                    longName: 'mockLongName'
                }],
                lastStartIdx: 0,
                lastStartLongName: 'mockLongName',
                lastStartTimestamp: 'mockTimeStamp',
                undoState: {
                    interested: [],
                    playing: [],
                    joined: [],
                    roomCode: 'foo'
                }
            };
            expect(component.showUndoAvailable()).toBe(true);
        });
        test('should return false when not available', () => {
            const component = new MainScreen(props);
            component.state = {
                ...component.state,
                history: [{
                    longName: 'mockLongName'
                }],
                lastStartIdx: 0,
                lastStartLongName: 'mockLongName',
                // lastStartTimestamp: 'mockTimeStamp',
                undoState: {}
            };
            expect(component.showUndoAvailable()).toBe(false);
        });
        test('should return false when no history available', () => {
            const component = new MainScreen(props);
            component.state = {
                ...component.state,
                history: [],
                lastStartIdx: 0,
                lastStartLongName: 'mockLongName',
                lastStartTimestamp: 'mockTimeStamp',
                undoState: {
                    interested: [],
                    playing: [],
                    joined: [],
                    roomCode: 'foo'
                }
            };
            expect(component.showUndoAvailable()).toBe(false);
        });
    });

    describe('startGame', () => {
        test('should call moveNextGameFwd only in the Player Select view', () => {
            const shallowRenderer = createRenderer();
            shallowRenderer.render(<MainScreen {...props}/>);

            let component = shallowRenderer.getMountedInstance();
            jest.spyOn(component, 'moveNextGameFwd').mockImplementation(() => {});

            component.setState({showPlayerSelect: true});
            expect(component.startGame()).toBeTruthy();

            component.setState({showPlayerSelect: false});
            expect(component.startGame()).toBeFalsy();

            component.setState({showPlayerSelect: true});
            expect(component.startGame({})).toBeTruthy();

            expect(component.moveNextGameFwd).toHaveBeenCalledTimes(2);

            shallowRenderer.unmount();
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

    describe('renderGameChosenModal', () => {
        test('should return a modal with confetti and call removeGame when clicked', () => {
            const component = new MainScreen(props);
            component.state = state;
            jest.spyOn(component, 'removeGame').mockImplementation(() => {});

            let output = component.renderGameChosenModal({
                longName: 'Survive The Internet (Party Pack 4)',
                name: 'Survive The Internet',
                partyPack: 'Party Pack 4'
            });
            expect(output).toMatchSnapshot();

            output = component.renderGameChosenModal({
                longName: 'Survive The Internet (Party Pack 4)',
                name: 'Survive The Internet',
                partyPack: 'Party Pack 4',
                username: 'dcpesses'
            });
            expect(output).toMatchSnapshot();

            output.props.children[1].props.onClick();
            expect(component.removeGame).toHaveBeenCalledTimes(1);
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

            // DISABLED FOR BOOTSTRAP TRANSITION
            // let logoutBtn = component.props.children.find(p => p.type === 'button');
            // logoutBtn.props.onClick();
            // expect(props.onLogout).toHaveBeenCalledTimes(1);

            shallowRenderer.unmount();
        });
        test('should render the game request screen with modal', () => {
            let state = {
                gameSelected: {
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
                },
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

            // DISABLED FOR BOOTSTRAP TRANSITION
            // let logoutBtn = component.props.children.find(p => p.type === 'button');
            // logoutBtn.props.onClick();
            // expect(props.onLogout).toHaveBeenCalledTimes(1);

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

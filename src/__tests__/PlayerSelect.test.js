import {createRenderer} from 'react-test-renderer/shallow';
import PlayerSelect from '../components/PlayerSelect';
import React from 'react';

describe('PlayerSelect', () => {

    const propsBlather = {
        game: {
            name: 'Blather \'Round',
            longName: 'Blather \'Round (Party Pack 7)',
            partyPack: 'Party Pack 7',
            'Min players': 2,
            'Max players': 6,
            Variants: [
                'blather',
                'blather round',
                'blather \'round',
                'blatherround',
                'blatheround'
            ],
            override: true
        },
        userLookup: {}
    };
    const propsTMP2 = {
        game: {
            name: 'Trivia Murder Party 2',
            longName: 'Trivia Murder Party 2 (Party Pack 6)',
            partyPack: 'Party Pack 6',
            'Min players': 1,
            'Max players': 8,
            Variants: [
                'tmp2',
                'tmp 2',
                'trivia murder party 2'
            ],
            username: 'dcpesses',
            time: 1627401634507,
            locked: false,
            chosen: false,
            override: false
        },
        userLookup: {}
    };
    const state = {
        interested: [
            {username: 'player4'},
            {username: 'player5', isPrioritySeat: true}
        ],
        playing: [
            {username: 'player1', isPrioritySeat: true},
            {username: 'player2', isPrioritySeat: true},
            {username: 'player3', isPrioritySeat: false},
            {username: 'player6', isPrioritySeat: false},
            {username: 'player7', isPrioritySeat: false},
            {username: 'player8'},
            {username: 'player9'}
        ],
        joined: [],
        streamerSeat: false,
        isQueueOpen: true,
        columnWidth: 524
    };

    describe('componentDidMount', () => {
        test('should create event listener and call updateColumnSizes', () => {
            jest.spyOn(window, 'addEventListener').mockImplementation(() => {});
            const component = new PlayerSelect(propsTMP2);
            jest.spyOn(component, 'updateColumnSizes').mockImplementation(()=>{});
            component.componentDidMount();
            expect(component.updateColumnSizes).toHaveBeenCalledTimes(1);
            expect(window.addEventListener).toHaveBeenCalledWith('resize', component.updateColumnSizes);
        });
    });

    describe('componentWillUnmount', () => {
        test('should remove event listener', () => {
            const component = new PlayerSelect(propsTMP2);
            jest.spyOn(window, 'removeEventListener').mockImplementation(() => {});
            component.componentWillUnmount();
            expect(window.removeEventListener).toHaveBeenCalledWith('resize', component.updateColumnSizes);
        });
    });

    describe('updateColumnSizes', () => {
        test('should update the column width', () => {
            const component = new PlayerSelect(propsTMP2);
            component.state = state;
            component.firstColumn = {
                current: {
                    offsetWidth: 100
                }
            };
            jest.spyOn(component, 'setState').mockImplementation(()=>{});

            component.updateColumnSizes();

            expect(component.setState).toHaveBeenCalledTimes(1);
            expect(component.setState.mock.calls[0][0](component.state)).toEqual({
                ...component.state,
                columnWidth: 100
            });
        });
    });

    describe('handleNewPlayerRequest', () => {
        const component = new PlayerSelect(propsTMP2);

        jest.spyOn(component, 'setState').mockImplementation(()=>{});
        jest.spyOn(component, 'removeUser').mockImplementation(()=>{});

        beforeEach(() => {
            component.state = {
                ...state,
                interested: [
                    {username: 'player4'},
                    {username: 'player5', isPrioritySeat: true}
                ],
                playing: [
                    {username: 'player1', isPrioritySeat: true},
                    {username: 'player2', isPrioritySeat: false},
                    {username: 'player3'}
                ],
                joined: [
                    {username: 'player9'}
                ],
            };
            jest.resetAllMocks();
        });

        test('should return the expected message when successful', () => {
            component.state.isQueueOpen = true;
            expect(component.handleNewPlayerRequest('player9', {})).toBe(
                'you are already in the lobby.'
            );
            expect(component.handleNewPlayerRequest('player10', {})).toBe(
                'you have successfully joined the lobby.'
            );
            expect(component.handleNewPlayerRequest('player11', {isPrioritySeat: true})).toBe(
                'you have been successfully added to the lobby.'
            );
            component.state.isQueueOpen = false;
            expect(component.handleNewPlayerRequest('player10', {})).toBe(
                'the queue is currently closed; users have already been selected for this game.'
            );
            expect(component.handleNewPlayerRequest('player11', {isPrioritySeat: true})).toBe(
                'you have been successfully added to the lobby.'
            );

            expect(component.removeUser).toHaveBeenCalledTimes(3);
            expect(component.setState).toHaveBeenCalledTimes(3);
            expect(component.setState.mock.calls[1][0](component.state)).toEqual({
                ...component.state,
                playing: [
                    ...component.state.playing,
                    {username: 'player11', isPrioritySeat: true}
                ]
            });
        });
        test('should return the expected message when an error occurs', () => {
            component.state.playing = null;
            component.state.interested = null;
            component.state.isQueueOpen = true;

            expect(component.handleNewPlayerRequest('player9', {})).toBe(
                'you are already in the lobby.'
            );
            expect(component.handleNewPlayerRequest('player10', {isPrioritySeat: true})).toBe(
                'there was an error adding you to the lobby.'
            );
            // component.state.isQueueOpen = false;
            expect(component.handleNewPlayerRequest('player11', {})).toBe(
                'there was an error adding you to the lobby.'
            );


            expect(component.removeUser).toHaveBeenCalledTimes(0);
            expect(component.setState).toHaveBeenCalledTimes(0);

        });
    });

    describe('removeUser', () => {
        test('should call setState', () => {
            const component = new PlayerSelect(propsTMP2);
            jest.spyOn(component, 'setState').mockImplementation(()=>{});
            component.state = {
                ...state,
                interested: [
                    {username: 'CrunchyButtMD'},
                    {username: 'HyalineRose'}
                ],
                playing: [
                    {username: 'Iniquity_Stepbro'},
                    {username: 'HiddenPudding'}
                ],
                joined: [
                    {username: 'Aurora88877'}
                ]
            };
            component.removeUser('HyalineRose');
            expect(component.setState).toHaveBeenCalledTimes(1);
            expect(component.setState.mock.calls[0][0](component.state)).toEqual({
                ...component.state,
                interested: [
                    {username: 'CrunchyButtMD'}
                ]
            });
        });
    });

    describe('clearQueue', () => {
        test('should clear the users from state', () => {
            const component = new PlayerSelect(propsTMP2);
            component.state = state;
            jest.spyOn(component, 'setState').mockImplementation(()=>{});

            component.clearQueue();

            expect(component.setState).toHaveBeenCalledTimes(1);
            expect(component.setState.mock.calls[0][0](component.state)).toEqual({
                ...component.state,
                interested: [],
                playing: [],
                joined: []
            });
        });
    });

    describe('openQueue', () => {
        test('should set an open queue state', () => {
            const component = new PlayerSelect(propsTMP2);
            component.state = state;
            jest.spyOn(component, 'setState').mockImplementation(()=>{});

            component.openQueue();

            expect(component.setState).toHaveBeenCalledTimes(1);
            expect(component.setState.mock.calls[0][0](component.state)).toEqual({
                ...component.state,
                isQueueOpen: true
            });
        });
    });

    describe('closeQueue', () => {
        test('should set a closed queue state', () => {
            const component = new PlayerSelect(propsTMP2);
            component.state = state;
            jest.spyOn(component, 'setState').mockImplementation(()=>{});

            component.closeQueue();

            expect(component.setState).toHaveBeenCalledTimes(1);
            expect(component.setState.mock.calls[0][0](component.state)).toEqual({
                ...component.state,
                isQueueOpen: false
            });
        });
    });

    describe('playerCount', () => {
        const component = new PlayerSelect(propsTMP2);
        component.state = state;

        test('should return number of players that will be playing, including streamer', () => {
            component.state.streamerSeat = true;
            expect(component.playerCount()).toBe(8);
        });
        test('should return number of players that will be playing, excluding streamer', () => {
            component.state.streamerSeat = false;
            expect(component.playerCount()).toBe(7);
        });
    });


    describe('toggleStreamerSeat', () => {
        test('should toggle the streamer seat state', () => {
            const component = new PlayerSelect(propsTMP2);
            component.state = state;
            component.state.streamerSeat = false;
            jest.spyOn(component, 'setState').mockImplementation(()=>{});

            component.toggleStreamerSeat();

            expect(component.setState).toHaveBeenCalledTimes(1);
            expect(component.setState.mock.calls[0][0](component.state)).toEqual({
                ...component.state,
                streamerSeat: true
            });
        });
    });

    describe('startGame', () => {
        test('should call props.startGame', () => {
            const component = new PlayerSelect(
                Object.assign({}, propsTMP2, {startGame: jest.fn()})
            );
            jest.spyOn(component, 'setState').mockImplementation(()=>{});

            let prevState = component.state;
            component.startGame();

            expect(component.setState).toHaveBeenCalledTimes(1);
            expect(component.setState.mock.calls[0][0](component.state)).toEqual({
                ...component.state,
                interested: [],
                playing: [],
                joined: [],
                roomCode: null,
                undoState: prevState
            });
            expect(component.props.startGame).toHaveBeenCalledTimes(1);
        });
    });

    describe('randomizePlayers', () => {
        test('should test all cases and branches', () => {
            // const mockMath = Object.create(global.Math);
            jest.spyOn(global.Math, 'floor')
                .mockImplementationOnce(()=>4)
                .mockImplementationOnce(()=>0)
                .mockImplementationOnce(()=>4)
                .mockImplementation(()=>2);

            const component = new PlayerSelect(propsBlather);
            component.state = {
                ...state,
                interested: [
                    {username: 'player4'},
                    {username: 'player5'},
                    {username: 'player6'},
                    {username: 'player7'},
                    {username: 'player8'}
                ],
                playing: [
                    {username: 'player1', isPrioritySeat: true},
                    {username: 'player2', isPrioritySeat: true},
                    {username: 'player3'}
                ],
            };
            jest.spyOn(component, 'setState').mockImplementation(()=>{});

            component.randomizePlayers();

            expect(component.setState).toHaveBeenCalledTimes(1);

            expect(component.setState.mock.calls[0][0](component.state).interested.length).toBe(2);
            expect(component.setState.mock.calls[0][0](component.state).playing.length).toBe(6);
        });
    });

    describe('render', () => {
        test('should render component', () => {
            const shallowRenderer = createRenderer();
            shallowRenderer.render(<PlayerSelect />);
            let component = shallowRenderer.getRenderOutput();
            expect(component).toMatchSnapshot();
            expect(component.type).toBe('div');
            shallowRenderer.unmount();
        });
        test('should render component using Blather data', () => {
            const shallowRenderer = createRenderer();
            shallowRenderer.render(<PlayerSelect game={propsBlather.game} userLookup={propsBlather.userLookup} />);
            let instance = shallowRenderer.getMountedInstance();
            instance.setState(state);
            let component = shallowRenderer.getRenderOutput();
            expect(component).toMatchSnapshot();
            shallowRenderer.unmount();
        });
        test('should render component using TMP2 data', () => {
            const shallowRenderer = createRenderer();
            shallowRenderer.render(<PlayerSelect game={propsTMP2.game} userLookup={propsTMP2.userLookup} />);
            let instance = shallowRenderer.getMountedInstance();
            instance.setState(state);
            expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
            shallowRenderer.unmount();
        });
    });
});

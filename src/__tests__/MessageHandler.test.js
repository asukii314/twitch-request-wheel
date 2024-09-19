import {createRenderer} from 'react-test-renderer/shallow';
import MessageHandler from '../MessageHandler';
import rawCommandList from './Commands.yaml';
import rawJackboxGameList from './JackboxGames.yaml';
import React from 'react';
import YAML from 'yaml'

jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox());
const fetch = require('node-fetch');

jest.mock('tmi.js');

describe('MessageHandler', () => {
    const props = {
        access_token: 'blahblahblahblahblah',
        channel: 'sirfarewell',
        modList: [
            'asukii314',
            'dcpesses'
        ],
        messages: {
            'Trivia Murder Party 2 (Party Pack 6)': {
                name: 'Trivia Murder Party 2',
                isSubRequest: false,
                longName: 'Trivia Murder Party 2 (Party Pack 6)',
                partyPack: 'Party Pack 6',
                Variants: [
                    "tmp2",
                    "tmp 2",
                    "trivia murder party 2"
                ],
                "Min players": 3,
                "Max players": 8,
                username: 'aurora88877',
                locked: false
            },
            'Quiplash 3 (Party Pack 7)': {
                name: 'Quiplash 3',
                isSubRequest: false,
                longName: 'Quiplash 3 (Party Pack 7)',
                partyPack: 'Party Pack 7',
                "Min players": 3,
                "Max players": 8,
                Variants: [
                    "ql3",
                    "ql 3",
                    "quip 3",
                    "quip3",
                    "quiplash 3",
                    "quiplash3"
                ],
                username: 'johnell75',
                locked: false
            },
            'Survive The Internet (Party Pack 4)': {
                name: 'Survive The Internet',
                isSubRequest: false,
                longName: 'Survive The Internet (Party Pack 4)',
                partyPack: 'Party Pack 4',
                'Min players': 3,
                'Max players': 8,
                Variants: ['survive', 'survive the internet', 'sti'],
                username: 'dcpesses',
                time: 1627509347466,
                locked: true,
                chosen: false
            }
        },
        upcomingGames: [],
        allowGameRequests: true
    };
    const upcomingGames = [
        {
            "name": "Split the Room",
            "longName": "Split the Room (Party Pack 5)",
            "partyPack": "Party Pack 5",
            "Min players": 3,
            "Max players": 8,
            "Variants": [
                "split the room",
                "splittheroom",
                "split room",
                "room split",
                "split",
                "str"
            ],
            "username": "dcpesses",
            "time": 1628114989864,
            "locked": false,
            "chosen": false,
            "override": false
        },
        {
            "name": "Fibbage 3",
            "longName": "Fibbage 3 (Party Pack 4)",
            "partyPack": "Party Pack 4",
            "Min players": 2,
            "Max players": 8,
            "Variants": [
                "fibbage 3",
                "fibbage3"
            ],
            "username": "dcpesses",
            "time": 1628114666823,
            "locked": false,
            "chosen": true,
            "override": false
        },
        {
            "name": "You Don't Know Jack",
            "longName": "You Don't Know Jack (Party Pack 5)",
            "partyPack": "Party Pack 5",
            "Min players": 1,
            "Max players": 8,
            "Variants": [
                "ydkj 2",
                "ydkj fs",
                "ydkjfs",
                "you dont know jack 2",
                "you don't know jack 2",
                "you don't know jack full stream",
                "you don't know jack full steam",
                "you don't know jack: full stream"
            ],
            "username": "dcpesses",
            "time": 1628114634007,
            "locked": false,
            "chosen": false
        }
    ];
    const validGames = {
        "Any Version": {
            "Quiplash": {
                "Min players": 3,
                "Max players": 8,
                "Variants": [
                    "quiplash",
                    "quip",
                    "ql"
                ]
            },
            "Trivia Murder Party": {
                "Min players": 1,
                "Max players": 8,
                "Variants": [
                    "tmp",
                    "trivia murder party"
                ]
            },
            "Fibbage": {
                "Min players": 2,
                "Max players": 8,
                "Variants": [
                    "fibbage"
                ]
            },
            "You Don't Know Jack": {
                "Min players": 1,
                "Max players": 8,
                "Variants": [
                    "ydkj",
                    "you dont know jack",
                    "you don't know jack"
                ]
            },
            "Drawful": {
                "Min players": 3,
                "Max players": 8,
                "Variants": [
                    "drawful",
                    "drawfull",
                    "draw full"
                ]
            }
        },
        "Party Pack 4": {
            "Fibbage: Enough About You": {
                "Min players": 2,
                "Max players": 8,
                "Variants": [
                    "eay",
                    "enough about you",
                    "feay",
                    "fibbage eay",
                    "fibbage: eay",
                    "fibbage enough about you",
                    "fibbage: enough about you"
                ]
            },
            "Fibbage 3": {
                "Min players": 2,
                "Max players": 8,
                "Variants": [
                    "fibbage 3",
                    "fibbage3"
                ]
            },
            "Survive The Internet": {
                "Min players": 3,
                "Max players": 8,
                "Variants": [
                    "survive",
                    "survive the internet",
                    "sti"
                ]
            },
        },
        "Party Pack 6": {
            "Trivia Murder Party 2": {
                "Min players": 1,
                "Max players": 8,
                "Variants": [
                    "tmp2",
                    "tmp 2",
                    "trivia murder party 2"
                ]
            },
            "Push The Button": {
                "Min players": 4,
                "Max players": 10,
                "Variants": [
                    "ptb",
                    "push the b",
                    "push the button",
                    "push da button"
                ]
            },
            "Dictionarium": {
                "Min players": 3,
                "Max players": 8,
                "Variants": [
                    "dictionarium",
                    "dictionary"
                ]
            },
            "Role Models": {
                "Min players": 3,
                "Max players": 6,
                "Variants": [
                    "role models",
                    "roles models",
                    "role model",
                    "rolemodel",
                    "rolemodels"
                ]
            },
            "Joke Boat": {
                "Min players": 3,
                "Max players": 8,
                "Variants": [
                    "joke boat",
                    "jokeboat"
                ]
            }
        },
        "Party Pack 7": {
            "Quiplash 3": {
                "Min players": 3,
                "Max players": 8,
                "Variants": [
                    "ql3",
                    "ql 3",
                    "quip 3",
                    "quip3",
                    "quiplash 3",
                    "quiplash3"
                ]
            },
            "Champ'd Up": {
                "Min players": 3,
                "Max players": 8,
                "Variants": [
                    "champd",
                    "champed",
                    "champd up",
                    "champ'd",
                    "champ'd up",
                    "champed up"
                ]
            },
            "Blather 'Round": {
                "Min players": 2,
                "Max players": 6,
                "Variants": [
                    "blather",
                    "blather round",
                    "blather 'round",
                    "blatherround",
                    "blatheround"
                ]
            },
            "Talking Points": {
                "Min players": 3,
                "Max players": 8,
                "Variants": [
                    "talking points",
                    "talkingpoints",
                    "talk points"
                ]
            },
            "The Devils and the Details": {
                "Min players": 3,
                "Max players": 8,
                "Variants": [
                    "devils",
                    "devils in details",
                    "devils and details",
                    "devils & details",
                    "devil's in details",
                    "devil's and details",
                    "devil's & details",
                    "devils in the details",
                    "devils and the details",
                    "devils & the details",
                    "devil's in the details",
                    "devil's and the details",
                    "devil's & the details",
                    "the devils in the details",
                    "the devils and the details",
                    "the devils & the details",
                    "the devil's in the details",
                    "the devil's and the details",
                    "the devil's & the details"
                ]
            }
        }
    };

    describe('componentDidMount', () => {
        test('should create a new Twitch client and call getCommandList & getGameList', () => {
            let component = new MessageHandler(props);
            jest.spyOn(component, 'getGameList').mockImplementation(()=>{});
            jest.spyOn(component, 'getCommandList').mockImplementation(()=>{});
            let _Client = {
                connect: jest.fn(),
                on: jest.fn()
            };
            jest.spyOn(component, 'getTwitchClient').mockImplementation(()=>{
                return _Client;
            });

            component.componentDidMount(props);

            expect(component.getTwitchClient).toHaveBeenCalledTimes(1);
            expect(_Client.on).toHaveBeenCalledTimes(1);
            expect(_Client.connect).toHaveBeenCalledTimes(1);
            expect(component.getCommandList).toHaveBeenCalledTimes(1);
            expect(component.getCommandList).toHaveBeenCalledWith(rawCommandList, _Client);
            expect(component.getGameList).toHaveBeenCalledTimes(1);
            expect(component.getGameList).toHaveBeenCalledWith(rawJackboxGameList, _Client);
        });
    });
    describe('getCommandList', () => {
        test('should call setState with valid game list and client object', async () => {
    		fetch.mock('/commandlist', {
                status: 200,
                body: rawCommandList
            });

            let component = new MessageHandler(props);
            jest.spyOn(component, 'setState').mockImplementation(()=>{});

            await component.getCommandList('/commandlist', {});

            expect(fetch).toHaveFetched('/commandlist');
            expect(component.setState).toHaveBeenCalledTimes(1);
            expect(component.setState).toHaveBeenCalledWith({
                client: {},
                validCommands: YAML.parse(rawCommandList)
            });
    		fetch.reset();
        });
        test('should log a warning to the console', async () => {
            jest.spyOn(console, 'warn').mockImplementation(()=>{});
            fetch.mock('/commandlist', {
                status: 404,
                throws: 'network error'
            });

            let component = new MessageHandler(props);
            jest.spyOn(component, 'setState').mockImplementation(()=>{});

            await component.getCommandList('/commandlist', {});

            expect(console.warn).toHaveBeenCalledWith('network error');
            expect(component.setState).not.toHaveBeenCalled();
        });
    });
    describe('getGameList', () => {
        test('should call setState with valid game list and client object', async () => {
    		fetch.mock('/gamelist', {
                status: 200,
                body: rawJackboxGameList
            });

            let component = new MessageHandler(props);
            jest.spyOn(component, 'setState').mockImplementation(()=>{});

            await component.getGameList('/gamelist', {});

            expect(fetch).toHaveFetched('/gamelist');
            expect(component.setState).toHaveBeenCalledTimes(1);
            expect(component.setState).toHaveBeenCalledWith({
                client: {},
                validGames: YAML.parse(rawJackboxGameList)
            });
    		fetch.reset();
        });
        test('should log a warning to the console', async () => {
            jest.spyOn(console, 'warn').mockImplementation(()=>{});
            fetch.mock('/gamelist', {
                status: 404,
                throws: 'network error'
            });

            let component = new MessageHandler(props);
            jest.spyOn(component, 'setState').mockImplementation(()=>{});

            await component.getGameList('/gamelist', {});

            expect(console.warn).toHaveBeenCalledWith('network error');
            expect(component.setState).not.toHaveBeenCalled();
        });
    });
    describe('getTwitchClient', () => {
        test('should return a new client', () => {
            let component = new MessageHandler(props);

            let output = component.getTwitchClient(props);
            expect(output).toBeDefined();
        });
    });
    describe('isModOrBroadcaster', () => {
        test('returns true only if the user is the channel host or mod', () => {
            let component = new MessageHandler(props);
            expect(component.isModOrBroadcaster('sirfarewell')).toBeTruthy();
            expect(component.isModOrBroadcaster('asukii314')).toBeTruthy();
            expect(component.isModOrBroadcaster('DCPesses')).toBeTruthy();
            expect(component.isModOrBroadcaster('mrscootscoot')).toBeFalsy();
        });
    });
    describe('checkForMiscCommands', () => {
        test('calls user commands without error', () => {
            let component = new MessageHandler(props);
            component.props.caniplayHandler = jest.fn().mockReturnValue(true);
            component.props.playerExitHandler = jest.fn();
            component.props.toggleAllowGameRequests = jest.fn();
            jest.spyOn(component, 'sendMessage').mockImplementation(()=>{});
            jest.spyOn(component, 'findGame')
                .mockReturnValueOnce(null)
                .mockReturnValueOnce({
                    name: 'Quiplash 3',
                    partyPack: 'Party Pack 7'
                });
            const username = 'mrscootscoot';
            expect(component.checkForMiscCommands('!gamelist', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!gameslist', username)).toBeTruthy();

            expect(component.checkForMiscCommands('!wheelcommands', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!whichpack', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!whichpack Doki Doki', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!whichpack Quiplash 3', username)).toBeTruthy();

            //========= advance next game =========
            expect(component.checkForMiscCommands('!advancenextgame', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!nextgameforward', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!nextgamefwd', username)).toBeTruthy();

            //========= advance prev game =========
            expect(component.checkForMiscCommands('!advanceprevgame', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!nextgameback', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!nextgamebackward', username)).toBeTruthy();

            //========= set next game =========
            expect(component.checkForMiscCommands('!setnextgame', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!setnextgame quiplash3', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!sng quiplash3', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!redeemgame quiplash3', username)).toBeTruthy();

            //========= player queue management =========
            expect(component.checkForMiscCommands('!caniplay', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!new', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!priorityseat', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!leave', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!clear', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!open', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!close', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!startgame', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!dew', username)).toBeUndefined();
            expect(component.checkForMiscCommands('!undefinedcommand', username)).not.toBeDefined();

            expect(component.findGame).toHaveBeenCalledWith('Quiplash 3', username);

            expect(component.props.caniplayHandler.mock.calls[0][1].sendConfirmationMsg).toBeTruthy();
            expect(component.props.caniplayHandler.mock.calls[1][1].sendConfirmationMsg).toBeFalsy();

            expect(component.props.playerExitHandler).toHaveBeenCalledWith(username);

            // console.log(component.sendMessage.mock.calls);
            expect(component.sendMessage).toHaveBeenCalledTimes(17);

            expect(component.sendMessage.mock.calls[0][0]).toEqual(
                expect.stringContaining('list of available games'),
            );
            expect(component.sendMessage.mock.calls[1][0]).toEqual(
                expect.stringContaining('list of available games'),
            );
            expect(component.sendMessage.mock.calls[2][0]).toEqual(
                expect.stringContaining('all supported commands'),
            );
            expect(component.sendMessage.mock.calls[3][0]).toEqual(
                expect.stringContaining('please specify the game you would like to look up'),
            );
            expect(component.sendMessage.mock.calls[3][0]).toEqual(
                expect.stringContaining('please specify the game you would like to look up'),
            );
            expect(component.sendMessage.mock.calls[4][0]).toEqual(
                expect.stringContaining('Quiplash 3 is a Party Pack 7 game'),
            );

            let moderatorOnlyResponses = component.sendMessage.mock.calls.slice(5).map(c => c[0]);
            expect(moderatorOnlyResponses.filter(m => m.indexOf('only channel moderators') === -1).length).toBe(0);
        });
        test('calls game-related admin/mod commands without error', () => {
            let upcomingGames = [{
                name: 'Joke Boat',
                partyPack: 'Party Pack 6'
            }, {
                name: 'Fibbage 3',
                partyPack: 'Party Pack 4'
            }];
            let component = new MessageHandler(
                Object.assign({}, props, {
                    changeNextGameIdx: jest.fn()
                        .mockReturnValueOnce(true)  // !advancenextgame
                        .mockReturnValueOnce(true)  // !nextgameforward
                        .mockReturnValueOnce(false) // !nextgamefwd
                        .mockReturnValueOnce(true)  // !nextgameback
                        .mockReturnValueOnce(false) // !nextgamebackward
                        .mockReturnValueOnce(true)
                        .mockReturnValue(false),
                    setNextGame: jest.fn()
                        .mockReturnValueOnce(0)
                        .mockReturnValueOnce(1)
                        .mockReturnValueOnce(2),
                    toggleAllowGameRequests: jest.fn(),
                    upcomingGames: []
                })
            );
            jest.spyOn(component, 'sendMessage').mockImplementation(()=>{});
            jest.spyOn(component, 'findGame')
                .mockReturnValueOnce(null)
                .mockReturnValue({
                    name: 'Quiplash 3',
                    partyPack: 'Party Pack 7'
                });

            const username = 'sirfarewell';

            //========= advance next game =========
            component.props.upcomingGames = upcomingGames;
            expect(component.checkForMiscCommands('!advancenextgame', username)).toBeTruthy();
            component.props.upcomingGames = [];
            expect(component.checkForMiscCommands('!nextgameforward', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!nextgamefwd', username)).toBeTruthy();

            //========= advance prev game =========
            component.props.upcomingGames = upcomingGames;
            expect(component.checkForMiscCommands('!nextgameback', username)).toBeTruthy();
            component.props.upcomingGames = [];
            expect(component.checkForMiscCommands('!nextgamebackward', username)).toBeTruthy();

            //========= set next game =========
            expect(component.checkForMiscCommands('!setnextgame', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!redeemgame', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!setnextgame quiplash3', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!redeemgame quiplash3', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!redeemgame quiplash3', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!redeemgame quiplash3', username)).toBeTruthy();

            expect(component.checkForMiscCommands('!undefinedcommand', username)).not.toBeDefined();

            // console.log(component.sendMessage.mock.calls);
            expect(component.props.setNextGame).toHaveBeenCalledTimes(3);

            expect(component.sendMessage).toHaveBeenCalledTimes(10);

            expect(component.sendMessage.mock.calls[0][0]).toEqual(
                expect.stringContaining('the next game has been changed to Joke Boat'),
            );
            expect(component.sendMessage.mock.calls[1][0]).toEqual(
                expect.stringContaining('the next game has been marked as "TBD"'),
            );
            expect(component.sendMessage.mock.calls[2][0]).toEqual(
                expect.stringContaining('there are no more games in the queue'),
            );
            expect(component.sendMessage.mock.calls[3][0]).toEqual(
                expect.stringContaining('the next game has been changed to Joke Boat'),
            );
            expect(component.sendMessage.mock.calls[4][0]).toEqual(
                expect.stringContaining('there are no previous games in the queue'),
            );
            expect(component.sendMessage.mock.calls[5][0]).toEqual(
                expect.stringContaining('please specify the game you would like to insert'),
            );
            expect(component.sendMessage.mock.calls[6][0]).toEqual(
                expect.stringContaining('please specify the game you would like to insert'),
            );
            expect(component.sendMessage.mock.calls[7][0]).toEqual(
                expect.stringContaining('Quiplash 3 has been inserted as the next game'),
            );
            expect(component.sendMessage.mock.calls[8][0]).toEqual(
                expect.stringContaining('Quiplash 3 has been inserted in the queue following 1 other manual game request'),
            );
            expect(component.sendMessage.mock.calls[9][0]).toEqual(
                expect.stringContaining('Quiplash 3 has been inserted in the queue following 2 other manual game requests'),
            );
        });
        test('calls player-related admin/mod commands without error', () => {
            let component = new MessageHandler(
                Object.assign({}, props, {
                    caniplayHandler: jest.fn(),
                    clearQueueHandler: jest.fn(),
                    closeQueueHandler: jest.fn(),
                    openQueueHandler: jest.fn(),
                    playerExitHandler: jest.fn(),
                    startGame: jest.fn()
                        .mockReturnValueOnce(true)
                        .mockReturnValueOnce(false),
                    toggleAllowGameRequests: jest.fn(),
                })
            );
            jest.spyOn(component, 'sendMessage').mockImplementation(()=>{});

            const username = 'sirfarewell';

            //========= player queue management =========
            expect(component.checkForMiscCommands('!caniplay', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!new', username)).toBeTruthy();

            expect(component.checkForMiscCommands('!redeemseat', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!priorityseat', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!redeemseat @jenn_kitty', username)).toBeTruthy();

            expect(component.checkForMiscCommands('!leave', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!murd', username)).toBeTruthy();

            expect(component.checkForMiscCommands('!clear', username)).toBeTruthy();

            expect(component.checkForMiscCommands('!open', username)).toBeTruthy();

            expect(component.checkForMiscCommands('!close', username)).toBeTruthy();

            expect(component.checkForMiscCommands('!startgame', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!startgame', username)).toBeTruthy();

            expect(component.checkForMiscCommands('!redeem', username)).toBeTruthy();

            expect(component.checkForMiscCommands('!listrequests', username)).toBeTruthy();

            expect(component.checkForMiscCommands('!disablerequests', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!enablerequests', username)).toBeTruthy();

            expect(component.checkForMiscCommands('!removeuser @jenn_kitty', username)).toBeTruthy();

            expect(component.checkForMiscCommands('!clearopen', username)).toBeTruthy();

            expect(component.checkForMiscCommands('!undefinedcommand', username)).not.toBeDefined();


            expect(component.props.caniplayHandler).toHaveBeenCalledTimes(3);
            expect(component.props.playerExitHandler).toHaveBeenCalledTimes(3);
            expect(component.props.clearQueueHandler).toHaveBeenCalledTimes(2);
            expect(component.props.openQueueHandler).toHaveBeenCalledTimes(2);
            expect(component.props.closeQueueHandler).toHaveBeenCalledTimes(1);
            expect(component.props.toggleAllowGameRequests).toHaveBeenCalledTimes(2);


            expect(component.sendMessage).toHaveBeenCalledTimes(8);
            expect(component.sendMessage.mock.calls[0][0]).toEqual(
                expect.stringContaining('please specify the user who has redeemed a priority seat'),
            );
            expect(component.sendMessage.mock.calls[1][0]).toEqual(
                expect.stringContaining('please specify the user who has redeemed a priority seat'),
            );
            expect(component.sendMessage.mock.calls[2][0]).toEqual(
                expect.stringContaining('the game has been started'),
            );
            expect(component.sendMessage.mock.calls[3][0]).toEqual(
                expect.stringContaining('the game was already started'),
            );
            expect(component.sendMessage.mock.calls[4][0]).toEqual(
                expect.stringContaining('this command is no longer supported'),
            );
            expect(component.sendMessage.mock.calls[5][0]).toEqual(
                expect.stringContaining(`@sirfarewell, Requested:`),
            );
            expect(component.sendMessage.mock.calls[6][0]).toEqual(
                expect.stringContaining('requests have now been disabled'),
            );
            expect(component.sendMessage.mock.calls[7][0]).toEqual(
                expect.stringContaining('requests have now been enabled'),
            );
        });
        test('calls easter eggs', () => {
            let component = new MessageHandler(
                Object.assign({}, props, {
                    caniplayHandler: jest.fn(),
                    channel: 'dewinblack',
                })
            );
            jest.spyOn(component, 'sendMessage').mockImplementation(()=>{});
            const username = 'sirfarewell';
            expect(component.checkForMiscCommands('!dew', username)).toBeTruthy();
            expect(component.props.caniplayHandler).toHaveBeenCalledTimes(1);
        });
        test('calls undoStart', () => {
            let component = new MessageHandler(
                Object.assign({}, props, {
                    undoStart: jest.fn(),
                    channel: 'sirfarewell',
                })
            );
            jest.spyOn(component, 'sendMessage').mockImplementation(()=>{});
            expect(component.checkForMiscCommands('!undostart', 'sirfarewell')).toBeTruthy();
            expect(component.checkForMiscCommands('!undostart', 'dewinblack')).toBeTruthy();
            expect(component.props.undoStart).toHaveBeenCalledTimes(1);
        });
        test('should handle requests to display commands', () => {
            let component = new MessageHandler(
                Object.assign({}, props, {
                    settings: {
                        useLinkForCommandList: false
                    },
                    channel: 'sirfarewell',
                })
            );
            component.state.validCommands = {
                'Game Requests': {
                    lastgame: {},
                    nextgame: {},
                    request: {},
                },
                'Seat Requests': {
                    clear: {},
                    close: {},
                    open: {},
                }
            };
            jest.spyOn(component, 'sendMessage').mockImplementation(()=>{});
            expect(component.checkForMiscCommands('!wheelcommands', 'sirfarewell')).toBeTruthy();
            expect(component.sendMessage.mock.calls[0][0]).toEqual(
                expect.stringContaining('!clear !close !lastgame !nextgame !open !request'),
            );
            component.props.settings.useLinkForCommandList = true;
            expect(component.checkForMiscCommands('!commands', 'sirfarewell')).toBeTruthy();
            expect(component.sendMessage.mock.calls[1][0]).toEqual(
                expect.stringContaining('all supported commands'),
            );
        });
    });
    describe('findGame', () => {
        const easterEggRequests = [
            {
                RequestName: 'Jackbox Party Pack 8',
                Response: 'Jackbox Party Pack 8 games are not available to play yet! Please come back after it\'s released on October 14th.',
                Variants: [
                    'jackbox party pack 8',
                    'job job'
                ]
            }, {
                RequestName: 'Goose',
                Response: 'please don\'t taunt the wheel. Honk.',
                Variants: [
                    'goose'
                ]
            }, {
                RequestName: 'Affection',
                Response: () => {
                    return 'there there, it\'s going to be okay. VirtualHug'
                },
                Variants: [
                    'affection'
                ]
            }
        ];
        const mockValidGames = {
            "Any Version": {
                "Trivia Murder Party": {
                    "Min players": 1,
                    "Max players": 8,
                    "Variants": [
                        "tmp",
                        "trivia murder party"
                    ]
                },
                "You Don't Know Jack": {
                    "Min players": 1,
                    "Max players": 8,
                    "Variants": [
                        "ydkj",
                        "you don't know jack"
                    ]
                },
                "Drawful": {
                    "Min players": 3,
                    "Max players": 8,
                    "Variants": [
                        "drawful",
                        "drawfull",
                        "draw full"
                    ]
                }
            },
            "Jackbox Bunion Pack": {
                "Mock Game": {
                    "Min players": 3,
                    "Max players": 8,
                    "Variants": []
                }
            }
        };
        test('should handle matching game requests', () => {
            let component = new MessageHandler(props);
            component.state.validGames = mockValidGames;

            jest.spyOn(component, 'sendMessage').mockImplementation(()=>{});

            let output = component.findGame('drawful', 'username');
            expect(component.sendMessage).toBeCalledTimes(0);
            expect(output.name).toBe('Drawful');
        });
        test('should strip extraneous characters from requests & variants and handle game requests', () => {
            let component = new MessageHandler(props);
            component.state.validGames = mockValidGames;

            jest.spyOn(component, 'sendMessage').mockImplementation(()=>{});

            let output = [
                component.findGame('draw ful', 'username'),
                component.findGame('triviamurderparty', 'username'),
                component.findGame('you don\'t know jack', 'username'),
            ];
            expect(component.sendMessage).toBeCalledTimes(0);
            expect(output[0].name).toBe('Drawful');
            expect(output[1].name).toBe('Trivia Murder Party');
            expect(output[2].name).toBe('You Don\'t Know Jack');
        });
        test('should handle string requests', () => {
            let component = new MessageHandler(props);

            jest.spyOn(component, 'sendMessage').mockImplementation(()=>{});

            component.findGame('goose', 'username');
            expect(component.sendMessage).toBeCalledTimes(1);
            expect(component.sendMessage).toBeCalledWith(`/me @username ${easterEggRequests[1].Response}`);
        });
        test('should handle requests with function responses', () => {
            let component = new MessageHandler(props);

            jest.spyOn(component, 'sendMessage').mockImplementation(()=>{});

            component.findGame('affection', 'username');
            expect(component.sendMessage).toBeCalledTimes(1);
            expect(component.sendMessage).toBeCalledWith(`/me @username ${easterEggRequests[2].Response()}`);
        });
        test('should handle existing requests', () => {
            let component = new MessageHandler(props);

            jest.spyOn(component, 'sendMessage').mockImplementation(()=>{});

            component.findGame('i am bread', 'username');
            expect(component.sendMessage).toBeCalledTimes(1);
            expect(component.sendMessage).toBeCalledWith(
                expect.stringContaining('could not be found in the list'),
            );
        });
    });
    describe('checkForGameCommand', () => {
        test('returns if no valid game request command is detected', () => {
            let component = new MessageHandler(props);

            jest.spyOn(component, 'findGame').mockReturnValue(true);
            jest.spyOn(component, 'sendMessage').mockImplementation(()=>{});

            expect(component.checkForGameCommand('!reeq tmp2', 'tttonypepperoni')).toBeUndefined();

            expect(component.sendMessage).not.toHaveBeenCalled();
            expect(component.findGame).not.toHaveBeenCalled();
        });
        test('calls sendMessage when no game is specified and returns', () => {
            let component = new MessageHandler(props);
            jest.spyOn(component, 'sendMessage').mockImplementation(()=>{});

            expect(component.checkForGameCommand('!request', 'arsonimp')).toBeNull();
            expect(component.sendMessage.mock.calls[0][0]).toEqual(
                expect.stringContaining('/me @arsonimp, please specify the game'),
            );
        });
        test('calls & returns findGame when a game is specified', () => {
            let component = new MessageHandler(props);
            jest.spyOn(component, 'findGame').mockReturnValue(true);

            expect(component.checkForGameCommand('!request tmp2 ', 'cactus_dad')).toBeTruthy();
            expect(component.findGame).toHaveBeenCalledWith('tmp2', 'cactus_dad');
        });
    });
    describe('checkForSubrequest', () => {
        test('returns if no valid game request command is detected', () => {
            let component = new MessageHandler(props);

            jest.spyOn(component, 'findGame').mockReturnValue(true);
            jest.spyOn(component, 'sendMessage').mockImplementation(()=>{});

            expect(component.checkForSubrequest('!reeq tmp2', 'tttonypepperoni', true)).toBeUndefined();

            expect(component.sendMessage).not.toHaveBeenCalled();
            expect(component.findGame).not.toHaveBeenCalled();
        });
        test('calls sendMessage when user is not a subscriber and returns', () => {
            let component = new MessageHandler(props);
            jest.spyOn(component, 'sendMessage').mockImplementation(()=>{});

            expect(component.checkForSubrequest('!subrequest', 'arsonimp', false)).toBeNull();
            expect(component.sendMessage.mock.calls[0][0]).toEqual(
                expect.stringContaining('/me @arsonimp, you must be a subscriber'),
            );
        });
        test('calls sendMessage when no game is specified and returns', () => {
            let component = new MessageHandler(props);
            jest.spyOn(component, 'sendMessage').mockImplementation(()=>{});

            expect(component.checkForSubrequest('!subrequest', 'left4red14', true)).toBeNull();
            expect(component.sendMessage.mock.calls[0][0]).toEqual(
                expect.stringContaining('/me @left4red14, please specify the game'),
            );
        });
        test('calls & returns findGame when a game is specified', () => {
            let component = new MessageHandler(props);
            jest.spyOn(component, 'findGame').mockReturnValue(true);

            expect(component.checkForSubrequest('!subrequest tmp2 ', 'cactus_dad', true)).toBeTruthy();
            expect(component.findGame).toHaveBeenCalledWith('tmp2', 'cactus_dad');
        });
    });
    describe('onMessage', () => {
        const target = 'dcpesses';
        const tags = {
            "badge-info": null,
            "badge-info-raw": null,
            "badges": {
                broadcaster: "1"
            },
            "badges-raw": "broadcaster/1",
            "client-nonce": "d406c6013cdc662d4a4726fe55c25943",
            "color": "#1E90FF",
            "display-name": "dcpesses",
            "emotes": null,
            "emotes-raw": null,
            "flags": null,
            "id": "dea09d13-50d8-4eec-9729-6299c988bf1e",
            "message-type": "chat",
            "mod": false,
            "room-id": "473294395",
            "subscriber": false,
            "tmi-sent-ts": "1628284838590",
            "turbo": false,
            "user-id": "473294395",
            "user-type": null,
            "username": target
        };
        test('handles !nextgame messages without error', () => {
            let component = new MessageHandler({
                ...props,
                onMessage: jest.fn(),
                addGameRequest: jest.fn(),
                onDelete: jest.fn(),
                sendMessage: jest.fn()
            });
            jest.spyOn(component, 'checkForMiscCommands')
                .mockReturnValueOnce(false)
                .mockReturnValue(true);

            jest.spyOn(component, 'sendMessage').mockImplementation(()=>{});

            expect(component.onMessage(target, tags, '!nextgame', true)).toBeUndefined();
            expect(component.onMessage(target, tags, '!nextgame', false)).toBeUndefined();
            component.props.upcomingGames = upcomingGames.slice(0, 1);
            expect(component.onMessage(target, tags, '!nextgame', false)).toBeUndefined();
            component.props.upcomingGames = upcomingGames.slice(0, 2);
            expect(component.onMessage(target, tags, '!nextgame', false)).toBeUndefined();
            component.props.upcomingGames = upcomingGames.slice(0, 3);
            expect(component.onMessage(target, tags, '!nextgame', false)).toBeUndefined();


            expect(component.sendMessage.mock.calls[0][0]).toEqual(
                expect.stringContaining('the next game hasn\'t been decided yet'),
            );
            expect(component.sendMessage.mock.calls[1][0]).toEqual(
                expect.stringContaining('the next game up is'),
            );
            expect(component.sendMessage.mock.calls[2][0]).toEqual(
                expect.stringContaining('followed by'),
            );
            expect(component.sendMessage.mock.calls[3][0]).toEqual(
                expect.stringContaining(' and '),
            );

        });
        test('handles !request messages without error', () => {
            let component = new MessageHandler({
                ...props,
                onMessage: jest.fn(),
                addGameRequest: jest.fn(),
                onDelete: jest.fn(),
                sendMessage: jest.fn(),
                upcomingGames
            });
            component.state.validGames = validGames;

            jest.spyOn(component, 'checkForMiscCommands').mockReturnValue(false);
            jest.spyOn(component, 'sendMessage').mockImplementation(()=>{});

            let tagsAlt = {
                ...tags,
                username: 'jenn_kitty'
            }

            expect(component.onMessage(target, tags, '!request no game', false)).toBeUndefined();
            expect(component.onMessage(target, tags, '!request quip3', false)).toBeUndefined();
            expect(component.onMessage(target, tags, '!request devils', false)).toBeUndefined();
            component.props.channel = target;
            expect(component.onMessage(target, tags, '!request devils', false)).toBeUndefined();
            expect(component.onMessage(tagsAlt.username, tagsAlt, '!request devils', false)).toBeUndefined();

            expect(component.sendMessage.mock.calls[0][0]).toEqual(
                expect.stringContaining('no game could not be found in the list'),
            );
            expect(component.sendMessage.mock.calls[1][0]).toEqual(
                expect.stringContaining('has already been requested'),
            );
            expect(component.sendMessage.mock.calls[2][0]).toEqual(
                expect.stringContaining('has been replaced with'),
            );
            expect(component.sendMessage.mock.calls[3][0]).toEqual(
                expect.stringContaining('since you have special broadcaster'),
            );
            expect(component.sendMessage.mock.calls[4][0]).toEqual(
                expect.stringContaining('has been added to the request queue'),
            );
        });
        test('handles !gamelist messages without error', () => {
            let component = new MessageHandler({
                ...props,
                onMessage: jest.fn(),
                addGameRequest: jest.fn(),
                onDelete: jest.fn(),
                sendMessage: jest.fn(),
                upcomingGames
            });
            component.state.validGames = validGames;

            jest.spyOn(component, 'sendMessage').mockImplementation(()=>{});

            expect(component.onMessage(target, tags, '!gamelist', false)).toBeUndefined();

            expect(component.sendMessage.mock.calls[0][0]).toEqual(
                expect.stringContaining('list of available games'),
            );

        });
        test('should list last played games from !lastgame command', () => {
            const previousGames = [
                {name: 'Split the Room'},
                {name: 'Fibbage 3'},
                {name: `Dirty Drawful`},
                {name: `You Don't Know Jack`},
            ];
            const component = new MessageHandler({
                ...props,
                onMessage: jest.fn(),
                sendMessage: jest.fn(),
                previousGames: []
            });

            jest.spyOn(component, 'sendMessage').mockImplementation(()=>{});

            expect(component.onMessage(target, tags, '!lastgame', false)).toBeUndefined();
            expect(component.sendMessage.mock.calls[0][0]).toEqual(
                expect.stringContaining('no games have been played yet'),
            );

            component.props.previousGames = previousGames;
            expect(component.onMessage(target, tags, '!lastgame', false)).toBeUndefined();
            expect(component.sendMessage.mock.calls[1][0]).toEqual(
                expect.stringContaining('was You Don\'t Know Jack, followed by Dirty Drawful, Fibbage 3, and Split the Room!'),
            );

            component.props.previousGames.pop();
            expect(component.onMessage(target, tags, '!lastgame', false)).toBeUndefined();
            expect(component.sendMessage.mock.calls[2][0]).toEqual(
                expect.stringContaining('was Dirty Drawful, followed by Fibbage 3, and Split the Room!'),
            );

            component.props.previousGames.pop();
            expect(component.onMessage(target, tags, '!lastgame', false)).toBeUndefined();
            expect(component.sendMessage.mock.calls[3][0]).toEqual(
                expect.stringContaining('was Fibbage 3, followed by Split the Room!'),
            );

            component.props.previousGames.pop();
            expect(component.onMessage(target, tags, '!lastgame', false)).toBeUndefined();
            expect(component.sendMessage.mock.calls[4][0]).toEqual(
                expect.stringContaining('was Split the Room!'),
            );
        });
    });
    describe('sendMessage', () => {
        test('calls state.client.say with channel and message', () => {
            let component = new MessageHandler(props);
            component.state.client = {
                say: jest.fn()
            };

            component.sendMessage('This is a dummy message.');

            expect(component.state.client.say).toHaveBeenCalledTimes(1);
            expect(component.state.client.say).toHaveBeenCalledWith('sirfarewell', 'This is a dummy message.');
        });
    });
    describe('render', () => {
        test('should returned an undefined component', () => {
            const shallowRenderer = createRenderer();
            shallowRenderer.render(<MessageHandler />);
            expect(shallowRenderer.getRenderOutput()).toBeNull();
            shallowRenderer.unmount();
        });
    })
});

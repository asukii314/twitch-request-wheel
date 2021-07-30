import {createRenderer} from 'react-test-renderer/shallow';
import MessageHandler from '../MessageHandler';
import React from 'react';

describe('MessageHandler', () => {
    const props = {
        access_token: 'blahblahblahblahblah',
        channel: 'sirfarewell',
        modList: [
            'asukii314',
            'dcpesses'
        ]
    };
    describe('isModOrBroadcaster', () => {
        test('returns true only if the user is the channel host or mod', () => {
            let component = new MessageHandler(props);
            expect(component.isModOrBroadcaster('sirfarewell')).toBeTruthy();
            expect(component.isModOrBroadcaster('asukii314')).toBeTruthy();
            expect(component.isModOrBroadcaster('DCPesses')).toBeTruthy();
            expect(component.isModOrBroadcaster('mrscootscoot')).toBeFalsy();
        });
    })
    describe('checkForMiscCommands', () => {
        test('calls user commands without error', () => {
            let component = new MessageHandler(props);
            component.props.caniplayHandler = jest.fn().mockReturnValue(true);
            component.props.playerExitHandler = jest.fn();
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
            expect(component.checkForMiscCommands('!nextgameback', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!nextgamebackward', username)).toBeTruthy();

            //========= set next game =========
            expect(component.checkForMiscCommands('!setnextgame', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!setnextgame quiplash3', username)).toBeTruthy();
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
            expect(component.checkForMiscCommands('!undefinedcommand', username)).not.toBeDefined();

            expect(component.findGame).toHaveBeenCalledWith('Quiplash 3', username);

            expect(component.props.caniplayHandler.mock.calls[0][1].sendConfirmationMsg).toBeTruthy();
            expect(component.props.caniplayHandler.mock.calls[1][1].sendConfirmationMsg).toBeFalsy();

            expect(component.props.playerExitHandler).toHaveBeenCalledWith(username);

            // console.log(component.sendMessage.mock.calls);
            expect(component.sendMessage).toHaveBeenCalledTimes(15);

            expect(component.sendMessage.mock.calls[0][0]).toEqual(
                expect.stringContaining('list of valid Jackbox games'),
            );
            expect(component.sendMessage.mock.calls[1][0]).toEqual(
                expect.stringContaining('list of valid Jackbox games'),
            );
            expect(component.sendMessage.mock.calls[2][0]).toEqual(
                expect.stringContaining('all supported commands'),
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
                        .mockReturnValueOnce(1),
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
            expect(component.checkForMiscCommands('!setnextgame quiplash3', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!redeemgame quiplash3', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!redeemgame quiplash3', username)).toBeTruthy();

            expect(component.checkForMiscCommands('!undefinedcommand', username)).not.toBeDefined();

            // console.log(component.sendMessage.mock.calls);
            expect(component.props.setNextGame).toHaveBeenCalledTimes(2);

            expect(component.sendMessage).toHaveBeenCalledTimes(8);

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
                expect.stringContaining('Quiplash 3 has been inserted as the next game'),
            );
            expect(component.sendMessage.mock.calls[7][0]).toEqual(
                expect.stringContaining('Quiplash 3 has been inserted in the queue following 1 other manual game request'),
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
                        .mockReturnValueOnce(false)
                })
            );
            jest.spyOn(component, 'sendMessage').mockImplementation(()=>{});

            const username = 'sirfarewell';

            //========= player queue management =========
            expect(component.checkForMiscCommands('!caniplay', username)).toBeTruthy();
            expect(component.checkForMiscCommands('!new', username)).toBeTruthy();

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

            expect(component.checkForMiscCommands('!undefinedcommand', username)).not.toBeDefined();


            expect(component.props.caniplayHandler).toHaveBeenCalledTimes(3);
            expect(component.props.playerExitHandler).toHaveBeenCalledTimes(2);
            expect(component.props.clearQueueHandler).toHaveBeenCalledTimes(1);
            expect(component.props.openQueueHandler).toHaveBeenCalledTimes(1);
            expect(component.props.closeQueueHandler).toHaveBeenCalledTimes(1);

            // console.log(component.sendMessage.mock.calls);
            expect(component.sendMessage).toHaveBeenCalledTimes(4);
            expect(component.sendMessage.mock.calls[0][0]).toEqual(
                expect.stringContaining('please specify the user who has redeemed a priority seat'),
            );
            expect(component.sendMessage.mock.calls[1][0]).toEqual(
                expect.stringContaining('the game has been started'),
            );
            expect(component.sendMessage.mock.calls[2][0]).toEqual(
                expect.stringContaining('the game was already started'),
            );
            expect(component.sendMessage.mock.calls[3][0]).toEqual(
                expect.stringContaining('this command is no longer supported'),
            );
        });
    });
    describe('findGame', () => {
        test.todo('calls sendMessage when no valid game found and returns');
        test.todo('returns valid game metadata if found');
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
    describe('onMessage', () => {
        test.todo('handles messages');
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

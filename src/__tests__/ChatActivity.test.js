import ChatActivity, {ActivityStatus} from '../ChatActivity';
import fetch from 'node-fetch';
jest.mock('node-fetch');

describe('ChatActivity', () => {
    describe('updateLastMessageTime', () => {
        test('should set timestamp of user message', () => {
            const chatActivity = new ChatActivity('user_x');
            chatActivity.lastMessageTimes = {
                user_x: 1000,
                user_y: 2000
            };
            chatActivity.updateLastMessageTime('user_y');

            expect(chatActivity.lastMessageTimes.user_x).toBe(1000);
            expect(chatActivity.lastMessageTimes.user_y).not.toBe(2000);
        });
    });

    describe('minsSinceLastChatMessage', () => {
        test('should return minutes since last user message', () => {
            const chatActivity = new ChatActivity('user_x');
            chatActivity.lastMessageTimes = {
                user_x: Date.now() - 60000,
                user_y: Date.now() - 120000
            };

            expect(chatActivity.minsSinceLastChatMessage('user_x')).toBe(1);
            expect(chatActivity.minsSinceLastChatMessage('user_y')).toBe(2);
        });
    });

    describe('getChatters', () => {
        test('should resolve with array of all users excluding broadcaster and vips', async () => {
            fetch.mockImplementation(() => {
                return Promise.resolve({
                    json: () => Promise.resolve({
                    	_links: {},
                    	chatter_count: 11,
                    	chatters: {
                    		broadcaster: [
                    			'sirfarewell'
                    		],
                    		vips: [
                    			'streamelements'
                    		],
                    		moderators: [
                    			'asukii314',
                                'dcpesses'
                    		],
                    		staff: [],
                    		admins: [],
                    		global_mods: [],
                    		viewers: [
                    			'dewinblack',
                                'HerooftheSprites',
                                'jenn_kitty',
                                'johnell75',
                                'lexatrex',
                                'monkeyseeeee',
                                'tttonypepperoni'
                    		]
                    	}
                    }),
                })
            });
            const chatActivity = new ChatActivity('sirfarewell');

            let output = await chatActivity.getChatters();

            expect(output.length).toBe(9);
            expect(output.indexOf('lexatrex')).not.toBe(-1);
            expect(output.indexOf('sirfarewell')).toBe(-1);
        });
        test('should resolve as null', async () => {
            fetch.mockImplementation(() => {
                return Promise.resolve({
                    json: () => Promise.resolve({}),
                })
            });
            const chatActivity = new ChatActivity('sirfarewell');

            expect(await chatActivity.getChatters()).toBeNull();
        });
        test('should catch error and return null', async () => {
            fetch.mockImplementation(() => {
                return Promise.reject({
                    error: 'error stub',
                })
            });
            const chatActivity = new ChatActivity('sirfarewell');

            expect(await chatActivity.getChatters()).toBeNull();
        });
    });
    describe('getStatusPromise', () => {
        test('should return ACTIVE for broadcaster', async () => {
            const chatActivity = new ChatActivity('user_x');

            expect(await chatActivity.getStatusPromise('user_x')).toBe(ActivityStatus.ACTIVE);
        });
        test('should return ACTIVE when user has recently sent a message', async () => {
            const chatActivity = new ChatActivity('user_x');
            chatActivity.lastMessageTimes = {
                user_x: Date.now() - 60000,
                user_y: Date.now() - 120000
            };
            jest.spyOn(chatActivity, 'minsSinceLastChatMessage').mockReturnValue(5);

            expect(await chatActivity.getStatusPromise('user_y')).toBe(ActivityStatus.ACTIVE);
        });
        test('should return IDLE when user has not recently sent a message but returned in api response', async () => {
            const chatActivity = new ChatActivity('user_x');

            jest.spyOn(chatActivity, 'minsSinceLastChatMessage').mockReturnValue(15);
            jest.spyOn(chatActivity, 'getChatters').mockResolvedValue(['user_x', 'user_y']);

            expect(await chatActivity.getStatusPromise('user_y')).toBe(ActivityStatus.IDLE);
        });
        test('should return DISCONNECTED when user is not returned in api response', async () => {
            const chatActivity = new ChatActivity('user_x');

            jest.spyOn(chatActivity, 'minsSinceLastChatMessage').mockReturnValue(15);
            jest.spyOn(chatActivity, 'getChatters').mockResolvedValue(['user_x']);

            expect(await chatActivity.getStatusPromise('user_y')).toBe(ActivityStatus.DISCONNECTED);
        });
    });
});

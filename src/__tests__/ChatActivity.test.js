import ChatActivity, {ActivityStatus} from '../ChatActivity';

describe('ChatActivity', () => {
    describe('getStatusPromise', () => {
        test('should return status', async () => {
            const channel = 'user_x';
            const chatActivity = new ChatActivity(channel);

            const output = await chatActivity.getStatusPromise('user_x');
            expect(output).toBe(ActivityStatus.ACTIVE);
        });
    });
});

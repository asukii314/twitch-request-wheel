import MessageHandler from './MessageHandler';
import React from 'react';
import { render } from '@testing-library/react';

describe('MessageHandler', () => {
    test('renders as undefined', async () => {
        let props = {};
        let {component} = render(<MessageHandler {...props} />);
        expect(component).not.toBeDefined();
    });
    describe('checkForMiscCommands', () => {
        test('renders component', async () => {
            let props = {
                access_token: 'foo',
                channel: 'user_xyz'
            };
            let component = new MessageHandler(props);
            jest.spyOn(component, 'sendMessage').mockImplementation(()=>{});
            const message = '!gamelist';
            const username = 'mrscootscoot';
            expect(component.checkForMiscCommands(message, username)).toBeTruthy();
            expect(component.sendMessage).toHaveBeenCalledTimes(1);
        });
    });
});

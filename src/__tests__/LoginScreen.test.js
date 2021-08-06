import {createRenderer} from 'react-test-renderer/shallow';
import LoginScreen from '../LoginScreen';
import React from 'react';

describe('ComponentTemplate', () => {

    describe('render', () => {
        test('should render without error', () => {
            const shallowRenderer = createRenderer();
            shallowRenderer.render(<LoginScreen />);

            let component = shallowRenderer.getRenderOutput();
            expect(component).not.toBe(null);
            shallowRenderer.unmount();
        });
    });
});

import App from '../App';
import {createRenderer} from 'react-test-renderer/shallow';
import React from 'react';

describe('App', () => {

    describe('render', () => {
        test('should render without error', () => {
            const shallowRenderer = createRenderer();
            shallowRenderer.render(<App />);

            let component = shallowRenderer.getRenderOutput();
            expect(component).not.toBe(null);
            shallowRenderer.unmount();
        });
    });
});

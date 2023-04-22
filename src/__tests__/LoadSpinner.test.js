import LoadSpinner from '../components/LoadSpinner';
import {createRenderer} from 'react-test-renderer/shallow';
import React from 'react';

describe('LoadSpinner', () => {

    describe('render', () => {
        test('should render without error', () => {
            const shallowRenderer = createRenderer();
            shallowRenderer.render(<LoadSpinner />);

            let component = shallowRenderer.getRenderOutput();
            expect(component).toMatchSnapshot();
            shallowRenderer.unmount();
        });
    });
});

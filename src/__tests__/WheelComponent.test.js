import {createRenderer} from 'react-test-renderer/shallow';
import React from 'react';
import WheelComponent from '../WheelComponent'


describe('WheelComponent', () => {
    it('is truthy', () => {
        expect(WheelComponent).toBeDefined()
    })
    test('should render the wheel', () => {
        let props = {
            segments: [],
            onWheelSpun: jest.fn()
        };
        const shallowRenderer = createRenderer();
        shallowRenderer.render(<WheelComponent {...props} />);
        let output = shallowRenderer.getRenderOutput();
        expect(output).toMatchSnapshot();
        shallowRenderer.unmount();
    });
});

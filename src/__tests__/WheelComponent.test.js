import {createRenderer} from 'react-test-renderer/shallow';
import React from 'react';
import WheelComponent from '../WheelComponent'
// import * as fakeStates from '../example-states';


describe('WheelComponent', () => {
    it('is truthy', () => {
        expect(WheelComponent).toBeDefined();
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
    test('should render the wheel with data', () => {
        let props = {
            segments: [
                "Survive The Internet (Party Pack 4)",
                "Quiplash (Any Version)"
            ],
            onWheelSpun: jest.fn(),
            segColors: [
                "#75a5e5",
                "#847cef",
                "#74aee0",
                "#86efed",
                "#63bbd8",
                "#c9d8ff",
                "#97ecef",
                "#bcefff",
                "#9caff4"
            ],
            onFinished: jest.fn(),
            isOnlyOnce: false,
            size: 250,
            upDuration: 100,
            downDuration: 1000,
            primaryColor: "white",
            contrastColor: "black",
            fontFamily: "Arial",
            multilineDelimiter:' (',
        };
        const shallowRenderer = createRenderer();
        shallowRenderer.render(<WheelComponent {...props} />);
        let output = shallowRenderer.getRenderOutput();
        expect(output).toMatchSnapshot();

        shallowRenderer.unmount();
    });
});

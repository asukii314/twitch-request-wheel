import {createRenderer} from 'react-test-renderer/shallow';
import { render, act } from '@testing-library/react';
import React from 'react';
import WheelComponent from '../WheelComponent'
// import * as fakeStates from '../example-states';

// Mock canvas 2d context (used by wheel drawing)
const mockContext = {
    save: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    arc: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    font: '',
    textBaseline: '',
    textAlign: '',
    translate: jest.fn(),
    rotate: jest.fn(),
    fillText: jest.fn(),
    clearRect: jest.fn(),
};

function createMockCanvas() {
    const canvas = document.createElement('canvas');
    canvas.getContext = jest.fn(() => mockContext);
    canvas.addEventListener = jest.fn();
    return canvas;
}

describe('WheelComponent', () => {
    let scrollToSpy;
    let originalGetElementById;
    let sharedMockCanvas;

    beforeEach(() => {
        jest.clearAllMocks();
        sharedMockCanvas = createMockCanvas();
        sharedMockCanvas.id = 'canvas';
        sharedMockCanvas.width = 600;
        sharedMockCanvas.height = 720;
        scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
        originalGetElementById = document.getElementById.bind(document);
        document.getElementById = jest.fn((id) => {
            const el = originalGetElementById(id);
            if (id === 'canvas' && el && el.tagName === 'CANVAS') {
                return sharedMockCanvas;
            }
            return el;
        });
    });

    afterEach(() => {
        scrollToSpy.mockRestore();
        if (document.getElementById !== originalGetElementById) {
            document.getElementById = originalGetElementById;
        }
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it('is truthy', () => {
        expect(WheelComponent).toBeDefined();
    })
    test('should render the wheel', () => {
        let props = {
            segments: [],
            onFinished: jest.fn(),
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

    test('calls window.scrollTo when enableScrollTop is true', () => {
        jest.useFakeTimers();
        render(
            <WheelComponent
                segments={['A']}
                segColors={['#fff']}
                enableScrollTop={true}
            />
        );
        jest.runAllTimers();
        expect(scrollToSpy).toHaveBeenCalledWith(0, 1);
        jest.useRealTimers();
    });

    test('does not call window.scrollTo when enableScrollTop is false', () => {
        scrollToSpy.mockClear();
        render(
            <WheelComponent
                segments={['A']}
                segColors={['#fff']}
                enableScrollTop={false}
            />
        );
        expect(scrollToSpy).not.toHaveBeenCalled();
    });

    test('clicking canvas calls onStart and starts spin', () => {
        jest.useFakeTimers();
        const onStart = jest.fn();
        render(
            <WheelComponent
                segments={['A', 'B']}
                segColors={['#fff', '#000']}
                onStart={onStart}
                upDuration={100}
                downDuration={1000}
            />
        );
        const canvas = document.getElementById('canvas');
        expect(canvas).toBeTruthy();
        const addCall = canvas.addEventListener.mock.calls.find((c) => c[0] === 'click');
        expect(addCall).toBeDefined();
        const clickHandler = addCall[1];
        clickHandler({ offsetX: 300, offsetY: 360 });
        expect(onStart).toHaveBeenCalled();
        jest.useRealTimers();
    });

    test('spin completes and calls onFinished after timer runs', () => {
        jest.useFakeTimers();
        const onFinished = jest.fn();
        // reduced values by 20x for sake of test brevity
        // else would have to wait 2+ seconds for test to complete
        // (upDuration: 100, downDuration: 1000)
        render(
            <WheelComponent
                segments={['A', 'B']}
                segColors={['#fff', '#000']}
                onFinished={onFinished}
                upDuration={5}
                downDuration={50}
            />
        );
        const canvas = document.getElementById('canvas');
        const addCall = canvas.addEventListener.mock.calls.find((c) => c[0] === 'click');
        act(() => {
            addCall[1]({ offsetX: 300, offsetY: 360 });
        });
        act(() => {
            jest.advanceTimersByTime(2500);
            jest.runAllTimers();
        });
        expect(onFinished).toHaveBeenCalled();
        expect(['A', 'B']).toContain(onFinished.mock.calls[0][0]);
        jest.useRealTimers();
    });

    test('calls onSpinProgress when provided during spin', () => {
        jest.useFakeTimers();
        const onSpinProgress = jest.fn();
        const onFinished = jest.fn();
        render(
            <WheelComponent
                segments={['X', 'Y']}
                segColors={['#f00', '#0f0']}
                onSpinProgress={onSpinProgress}
                onFinished={onFinished}
                upDuration={100}
                downDuration={1000}
            />
        );
        const canvas = document.getElementById('canvas');
        const addCall = canvas.addEventListener.mock.calls.find((c) => c[0] === 'click');
        act(() => {
            addCall[1]({ offsetX: 300, offsetY: 360 });
        });
        act(() => {
            jest.advanceTimersByTime(100);
            jest.runOnlyPendingTimers();
        });
        expect(onSpinProgress).toHaveBeenCalled();
        const call = onSpinProgress.mock.calls[0][0];
        expect(call).toHaveProperty('finished');
        expect(call).toHaveProperty('progress');
        expect(call).toHaveProperty('frames');
        jest.useRealTimers();
    });

    test('renders with default props', () => {
        const { container } = render(
            <WheelComponent segments={['One']} segColors={['#ccc']} />
        );
        expect(container.querySelector('#wheel')).toBeTruthy();
        expect(container.querySelector('#canvas')).toBeTruthy();
    });

    test('canvas has pointerEvents none when spin finished and isOnlyOnce', () => {
        jest.useFakeTimers();
        const onFinished = jest.fn();
        const { container } = render(
            <WheelComponent
                segments={['A', 'B']}
                segColors={['#fff', '#000']}
                onFinished={onFinished}
                isOnlyOnce={true}
                upDuration={5}
                downDuration={50}
            />
        );
        const canvasEl = container.querySelector('#canvas');
        expect(canvasEl.style.pointerEvents).not.toBe('none');
        const canvas = document.getElementById('canvas');
        const addCall = canvas.addEventListener.mock.calls.find((c) => c[0] === 'click');
        act(() => {
            addCall[1]({ offsetX: 300, offsetY: 360 });
        });
        act(() => {
            jest.advanceTimersByTime(2500);
            jest.runAllTimers();
        });
        expect(onFinished).toHaveBeenCalled();
        expect(container.querySelector('#canvas').style.pointerEvents).toBe('none');
        jest.useRealTimers();
    });

    test('uses custom size, wheelHeight, wheelWidth, and buttonText', () => {
        const { container } = render(
            <WheelComponent
                segments={['A']}
                segColors={['#fff']}
                size={200}
                wheelHeight={400}
                wheelWidth={500}
                buttonText="SPIN"
            />
        );
        const canvas = container.querySelector('#canvas');
        expect(canvas).toBeTruthy();
        expect(canvas.getAttribute('width')).toBe('500');
        expect(canvas.getAttribute('height')).toBe('400');
    });

    test('IE path creates canvas via createElement when getElementById returns null', () => {
        const wheelDiv = document.createElement('div');
        wheelDiv.id = 'wheel';
        document.body.appendChild(wheelDiv);
        jest.spyOn(wheelDiv, 'appendChild');
        const mockCanvas = createMockCanvas();
        const originalCreateElement = Document.prototype.createElement;
        const createElementSpy = jest.spyOn(Document.prototype, 'createElement').mockImplementation(function (tagName) {
            if (tagName.toLowerCase() === 'canvas') return mockCanvas;
            return originalCreateElement.call(this, tagName);
        });
        const getElementByIdImpl = document.getElementById.bind(document);
        document.getElementById = jest.fn((id) => {
            if (id === 'canvas') return null;
            if (id === 'wheel') return wheelDiv;
            return getElementByIdImpl(id);
        });
        const appVersionDesc = Object.getOwnPropertyDescriptor(navigator, 'appVersion');
        Object.defineProperty(navigator, 'appVersion', { value: 'MSIE 11.0', configurable: true });
        render(<WheelComponent segments={['A']} segColors={['#fff']} />);
        expect(document.getElementById).toHaveBeenCalledWith('canvas');
        expect(wheelDiv.appendChild).toHaveBeenCalledWith(mockCanvas);
        if (appVersionDesc) Object.defineProperty(navigator, 'appVersion', appVersionDesc);
        document.getElementById = originalGetElementById;
        createElementSpy.mockRestore();
        document.body.removeChild(wheelDiv);
    });
});

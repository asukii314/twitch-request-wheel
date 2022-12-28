import OptionsMenu from '../landing/OptionsMenu';
import {createRenderer} from 'react-test-renderer/shallow';
import React from 'react';

describe('OptionsMenu', () => {
    describe('initial state', () => {
        test('should return the base state object and default props', () => {
            let component = new OptionsMenu();
            let {state} = component;
            expect(state.showGameList).toBe(false);

            let props = OptionsMenu.defaultProps;
            expect(props.onHide()).toBeUndefined();
            expect(props.onLogout()).toBeUndefined();
            expect(props.showOptionsMenu).toBe(false);
        });
    });
    describe('toggleGameList', () => {
        test('should change state.showGameList', () => {
            const component = new OptionsMenu();
            jest.spyOn(component, 'setState').mockImplementation(()=>{});

            component.toggleGameList();

            expect(component.setState).toHaveBeenCalledTimes(1);
            expect(component.setState.mock.calls[0][0]({})).toEqual({showGameList: true});
        });
    });
    describe('render', () => {
        test('should render without error', () => {
            const shallowRenderer = createRenderer();
            shallowRenderer.render(<OptionsMenu />);

            let component = shallowRenderer.getRenderOutput();
            expect(component).not.toBe(null);
            shallowRenderer.unmount();
        });
    });
});

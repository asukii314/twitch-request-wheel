import Sidebar from '../Sidebar';
import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event'


describe('Sidebar', () => {

    describe('constructor', () => {
        test('should return the base state object', () => {
            let component = new Sidebar();
            let state = component.state;

            expect(state.index).toBe(0);
        });
    });

    describe('printGame', () => {
        const component = new Sidebar({
            history: [
                {name: 'blather'},
                {name: 'tmp2'}
            ],
            nextGameIdx: 1
        });
        test('should return the game name as-is', () => {
            let game = component.printGame(0);

            expect(game).toBe('blather');
        });
        test('should return the game name rendered with bold tags', () => {
            let game = component.printGame(1);

            expect(game.type).toBe('b');
            expect(game.props.children).toBe('tmp2');
        });
    });

    describe('render', () => {
        test('renders empty page', () => {
            let props = {
                history: [],
                nextGameIdx: 0,
                changeNextGameIdx: ()=>{},
                togglePlayerSelect: ()=>{},
                requestMode: null,    // valid responses: 'seat', 'game'
            }
            render(<Sidebar {...props} />);
            const headerUpNext = screen.getByText(/Up Next:/i);
            expect(headerUpNext).toBeInTheDocument();
        });
        test('renders empty game page', () => {
            let props = {
                history: [],
                nextGameIdx: 0,
                changeNextGameIdx: ()=>{},
                togglePlayerSelect: ()=>{},
                requestMode: 'game',
            }
            render(<Sidebar {...props} />);
            const headerUpNext = screen.getByText(/Up Next:/i);
            expect(headerUpNext).toBeInTheDocument();
        });
        test('renders empty seat page', () => {
            let props = {
                history: [],
                nextGameIdx: 0,
                changeNextGameIdx: ()=>{},
                togglePlayerSelect: ()=>{},
                requestMode: 'seat',
            }
            render(<Sidebar {...props} />);
            const headerUpNext = screen.getByText(/Up Next:/i);
            expect(headerUpNext).toBeInTheDocument();
        });
        test('renders page with content', () => {
            let props = {
                history: [{
                    name: 'Blather \'Round',
                    partyPack: 'Party Pack 7'
                }, {
                    name: 'Trivia Murder Party 2',
                    partyPack: 'Party Pack 6'
                }, {
                    name: 'Survive The Internet',
                    partyPack: 'Party Pack 4'
                }],
                nextGameIdx: 1,
                changeNextGameIdx: jest.fn(),
                moveNextGameFwd: jest.fn(),
                moveNextGameBack: jest.fn(),
                togglePlayerSelect: jest.fn(),
                requestMode: 'game',    // valid responses: 'seat', 'game'
            };
            const {container} = render(<Sidebar {...props} />);
            const headerUpNext = screen.getByText(/Up Next:/i);
            expect(headerUpNext).toBeInTheDocument();
            userEvent.click(container.querySelector('button.move-next-game-fwd'));
            expect(props.changeNextGameIdx).toHaveBeenCalledWith(1);
            userEvent.click(container.querySelector('button.move-next-game-back'));
            expect(props.changeNextGameIdx).toHaveBeenCalledWith(-1);
            expect(props.changeNextGameIdx).toHaveBeenCalledTimes(2);
        });
    });
});

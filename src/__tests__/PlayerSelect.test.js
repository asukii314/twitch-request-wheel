import {createRenderer} from 'react-test-renderer/shallow';
import PlayerSelect from '../PlayerSelect';
import React from 'react';

describe('PlayerSelect', () => {

    const propsBlather = {
        game: {
            name: 'Blather \'Round',
            longName: 'Blather \'Round (Party Pack 7)',
            partyPack: 'Party Pack 7',
            'Min players': 2,
            'Max players': 6,
            Variants: [
                'blather',
                'blather round',
                'blather \'round',
                'blatherround',
                'blatheround'
            ],
            override: true
        }
    };
    const propsTMP2 = {
        game: {
            name: 'Trivia Murder Party 2',
            longName: 'Trivia Murder Party 2 (Party Pack 6)',
            partyPack: 'Party Pack 6',
            'Min players': 1,
            'Max players': 8,
            Variants: [
                'tmp2',
                'tmp 2',
                'trivia murder party 2'
            ],
            username: 'dcpesses',
            time: 1627401634507,
            locked: false,
            chosen: false,
            override: false
        }
    };
    const state = {
        interested: [
            {username: 'player4'},
            {username: 'player5', isPrioritySeat: true}
        ],
        playing: [
            {username: 'player1', isPrioritySeat: true},
            {username: 'player2', isPrioritySeat: true},
            {username: 'player3', isPrioritySeat: false},
            {username: 'player6', isPrioritySeat: false},
            {username: 'player7', isPrioritySeat: false},
            {username: 'player8'},
            {username: 'player9'}
        ],
        joined: [],
        streamerSeat: false,
        isQueueOpen: true,
        columnWidth: 524
    };


    xdescribe('handleNewPlayerRequest', () => {
        test.skip('should', () => {
        });
    });
    xdescribe('updateColumnForUser', () => {
        test.skip('should', () => {
        });
    });
    xdescribe('randomizePlayers', () => {
        test.skip('should', () => {
        });
    });


    describe('render', () => {
        test('should render component', () => {
            const shallowRenderer = createRenderer();
            shallowRenderer.render(<PlayerSelect />);
            let component = shallowRenderer.getRenderOutput();
            expect(component).toMatchSnapshot();
            expect(component.type).toBe('div');
            shallowRenderer.unmount();
        });
        test('should render component using Blather data', () => {
            const shallowRenderer = createRenderer();
            shallowRenderer.render(<PlayerSelect game={propsBlather.game} />);
            let instance = shallowRenderer.getMountedInstance();
            instance.setState(state);
            expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
            shallowRenderer.unmount();
        });
        test('should render component using TMP2 data', () => {
            const shallowRenderer = createRenderer();
            shallowRenderer.render(<PlayerSelect game={propsTMP2.game} />);
            let instance = shallowRenderer.getMountedInstance();
            instance.setState(state);
            expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
            shallowRenderer.unmount();
        });
    });
});

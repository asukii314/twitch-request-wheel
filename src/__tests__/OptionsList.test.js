import {createRenderer} from 'react-test-renderer/shallow';
import fetch from 'node-fetch';
import OptionsList from '../OptionsList';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import yamlGameList from '../JackboxGames.yaml';
import YAML from 'yaml'

jest.mock('node-fetch');

const VALID_GAMES = YAML.parse(yamlGameList);
const ALLOWED_GAMES = {
    Any_Version_Quiplash:{
        id: "Any_Version_Quiplash",
        game: "Quiplash",
        pack: "Any Version",
        enabled: true
    },
    Any_Version_Trivia_Murder_Party:{
        id: "Any_Version_Trivia_Murder_Party",
        game: "Trivia Murder Party",
        pack: "Any Version",
        enabled: true
    },
    Party_Pack_1_Drawful:{
        id: "Party_Pack_1_Drawful",
        game: "Drawful",
        pack: "Party Pack",
        enabled: false
    },
    Party_Pack_1_You_Don_t_Know_Jack:{
        id: "Party_Pack_1_You_Don_t_Know_Jack",
        game: "You Don't Know Jack",
        pack: "Party Pack",
        enabled: true
    }
};

describe('OptionsList', () => {
    describe('setAllowedGames', () => {
        test('should parse localStorage item when set', () => {
            jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(JSON.stringify(ALLOWED_GAMES));
            jest.spyOn(JSON, 'parse').mockReturnValue(ALLOWED_GAMES);
            let component = new OptionsList();
            jest.spyOn(component, 'setState').mockImplementation(()=>{});

            component.state.validGames = VALID_GAMES;
            component.setAllowedGames(VALID_GAMES);

            expect(window.localStorage.__proto__.getItem).toHaveBeenCalledTimes(1);
            expect(component.setState).toHaveBeenCalledTimes(1);
        });
    });

    describe('render', () => {
        test('should render without error', () => {
            const shallowRenderer = createRenderer();
            shallowRenderer.render(<OptionsList />);

            let component = shallowRenderer.getRenderOutput();
            // console.log('component:', JSON.stringify(component, null, 2));
            expect(component.props.className).toBe('partyPackList');
            shallowRenderer.unmount();
        });
        test('should render using validGames in state', () => {
            const shallowRenderer = createRenderer();
            shallowRenderer.render(<OptionsList />);

            let instance = shallowRenderer.getMountedInstance();
            instance.setState({
                allowedGames: ALLOWED_GAMES,
                validGames: VALID_GAMES
            });

            let component = shallowRenderer.getRenderOutput();
            expect(component.props.className).toBe('partyPackList');
            expect(component).toMatchSnapshot();
            shallowRenderer.unmount();
        });
        test('renders component with yaml content', async () => {
            fetch.mockImplementation(() => {
                return Promise.resolve({
                    text: () => Promise.resolve(yamlGameList),
                })
            });

            let props = {};
            let {container} = render(<OptionsList {...props} />);

            await waitFor(() => screen.getByText(/Trivia Murder Party/i));
            expect(screen.getByText(/Trivia Murder Party/i)).toBeInTheDocument();
            expect(container).toMatchSnapshot(); // TODO: fix incorrect checkbox values
        });
    });
});

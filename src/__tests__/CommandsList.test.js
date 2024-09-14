import CommandsList from '../CommandsList';
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import fetch from 'node-fetch';
jest.mock('node-fetch');

const yamlCommandsList = `
Game Requests:
  request:
    Example: '!request MSM'
    Availability: 'Everyone'
    Description: 'Adds the requested game to the wheel. (If you already had a different active game request, it will be replaced - unless you are the broadcaster.)'
    OnScreenEquivalent: 'n/a'
    Variants: '!request'

  subrequest:
    Example: '!subrequest MSM'
    Availability: 'Subscribers'
    Description: 'Adds the requested game to the wheel in a separate section when enabled in settings; this will not replace a previously request game using the !request command. (If you already had a different active game request, it will be not replaced unless Limit 1 Sub Request is enabled in streamer settings.)'
    OnScreenEquivalent: 'n/a'
    Variants: 'n/a'

Seat Requests:
  new:
    Example: '!new'
    Availability: 'Everyone'
    Description: 'Adds the requesting user to the "interested" column. (If the !caniplay command is used, a confirmation message will be sent in chat.)'
    OnScreenEquivalent: 'n/a'
    Variants: '!caniplay'

Other / Misc:
  whichpack:
    Example: '!whichpack TMP 2'
    Availability: 'Everyone'
    Description: 'Looks up the specified game and responds with which party pack (if any) it is in.'
    OnScreenEquivalent: 'n/a'
    Variants: 'n/a'
`;

describe('CommandsList', () => {
    describe('onSelectTab', () => {
        test('should handle all cases', () => {
            let component = new CommandsList({});
            jest.spyOn(component, 'setState').mockImplementation(()=>{});
            component.onSelectTab('All Commands');
            component.onSelectTab('Game Commands');
            // console.log('component.setState.mock.calls:', component.setState.mock.calls);
            expect(component.setState.mock.calls[0]).toEqual([{
                activeFilter: null
            }], [{
                activeFilter: 'Game Commands'
            }])
        });
    });
    describe('render', () => {
        let props;
        beforeEach(()=>{
            fetch.mockImplementation(() => {
                return Promise.resolve({
                    text: () => Promise.resolve(yamlCommandsList),
                })
            });

            props = {};
        });

        test('renders component with list of all commands using yaml content', async () => {
            let {container} = render(<CommandsList {...props} />);

            await waitFor(() => screen.getByText(/All Commands/i));
            expect(screen.queryByText(/!subrequest MSM/i)).toBeInTheDocument();
            expect(screen.queryByText(/!whichpack TMP 2/i)).toBeInTheDocument();
            expect(container).toMatchSnapshot();
        });
        test('renders component with filtered list of commands yaml content', async () => {
            render(<CommandsList {...props} />);

            await waitFor(() => screen.getByText(/All Commands/i));

            fireEvent.click(screen.getByTestId('Other / Misc'));

            await waitFor(() => screen.getByText(/All Commands/i));
            expect(screen.queryByText(/!subrequest MSM/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/!whichpack TMP 2/i)).toBeInTheDocument();

            fireEvent.click(screen.getByText(/All Commands/i));

            await waitFor(() => screen.getByText(/All Commands/i));
            expect(screen.queryByText(/!subrequest MSM/i)).toBeInTheDocument();
            expect(screen.queryByText(/!whichpack TMP 2/i)).toBeInTheDocument();
        });
    });

});

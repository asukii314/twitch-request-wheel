import {AuthenticatedApp} from '../AuthenticatedApp';
import {createRenderer} from 'react-test-renderer/shallow';
import fetch from 'node-fetch';
import MainScreen from '../MainScreen';
import React from 'react';
import {Redirect} from "react-router-dom";

jest.mock('../MainScreen');
jest.mock('node-fetch');
jest.mock('react-router-dom', () => {
    const reactRouterDom = jest.requireActual('react-router-dom');
    return {
        ...reactRouterDom,
        Redirect: () => () => (<div>React Tooltip Mock</div>)
    };
});

describe('AuthenticatedApp', () => {
    // TODO: fix the following error from AuthenticatedApp (when importing the default class):
    // Error: Invariant failed: You should not use <withRouter(AuthenticatedApp) /> outside a <Router>
    let props = {
    	history: {
    		length: 3,
    		action: 'POP',
    		location: {
    			pathname: '/',
    			search: '?code=foobar&scope=chat:read chat:edit moderation:read',
    			hash: ""
    		}
    	},
    	location: {
    		pathname: '/',
    		search: '?code=foobar&scope=chat:read chat:edit moderation:read',
    		hash: ""
    	},
    	match: {
    		path: '/',
    		url: '/',
    		isExact: true,
    		params: {}
    	}
    };

    describe('componentDidMount', () => {
        test('should call getAuth when no access_token set in state', () => {
            let component = new AuthenticatedApp();
            jest.spyOn(component, 'getAuth').mockResolvedValue(null);

            component.componentDidMount();
            expect(component.getAuth).toHaveBeenCalledTimes(1);
        });
        test('should call getUsers when access_token found in state', () => {
            let component = new AuthenticatedApp();
            jest.spyOn(component, 'getUsers').mockResolvedValue(null);
            component.state.access_token = 'vroom-vroom-lewmon-crew';

            component.componentDidMount();

            expect(component.getUsers).toHaveBeenCalledTimes(1);
        });
        test('should call getAuth when an error is caught from getUsers', async () => {
            let component = new AuthenticatedApp();
            jest.spyOn(component, 'getAuth').mockResolvedValue(null);
            jest.spyOn(component, 'getUsers').mockRejectedValue('error stub');
            jest.spyOn(console, 'error').mockImplementation(() => {});
            component.state.access_token = 'vroom-vroom-lewmon-crew';

            await component.componentDidMount();

            expect(component.getUsers).toHaveBeenCalledTimes(1);
            expect(component.getAuth).toHaveBeenCalledTimes(1);
        });
    });

    describe('getAuth', () => {
        const props = {
            location: {
                search: 'code=54vabs9d2sd1f08pk4bjmwyjpx3iju&scope=chat%3Aread+chat%3Aedit+moderation%3Aread'
            }
        }
        test('should call setState and getUsers', async () => {
            jest.spyOn(window.localStorage.__proto__, 'removeItem');
            fetch.mockImplementation(() => {
                return Promise.resolve({
                    json: () => Promise.resolve({
                        access_token: 'vroom-vroom-lewmon-crew'
                    }),
                })
            });
            let component = new AuthenticatedApp(props);
            jest.spyOn(component, 'getUsers').mockResolvedValue(true);
            jest.spyOn(component, 'setState').mockImplementation(() => {});
            component._isMounted = true;
            component.props = props;

            await component.getAuth();

            expect(window.localStorage.__proto__.removeItem).toHaveBeenCalledTimes(2);
            expect(component.getUsers).toHaveBeenCalledTimes(1);
            expect(component.setState).toHaveBeenCalledWith({access_token: 'vroom-vroom-lewmon-crew'});
        });
        test('should log events if passed and only call setState if no token returned', async () => {
            jest.spyOn(console, 'error');
            jest.spyOn(window.localStorage.__proto__, 'removeItem');
            fetch.mockImplementation(() => {
                return Promise.resolve({
                    json: () => Promise.resolve({}),
                })
            });
            let component = new AuthenticatedApp(props);
            jest.spyOn(component, 'setState').mockImplementation(() => {});
            component._isMounted = true;
            component.props = props;

            await component.getAuth('error stub');

            expect(console.error).toHaveBeenCalledWith('error stub');
            expect(window.localStorage.__proto__.removeItem).toHaveBeenCalledTimes(2);
            expect(component.setState).toHaveBeenCalledWith({
                failed_login: true
            });
        });
        test('should catch any fetch errors and call setState', async () => {
            jest.spyOn(window.localStorage.__proto__, 'removeItem');
            fetch.mockImplementation(() => {
                return Promise.resolve({
                    json: () => Promise.reject({}),
                })
            });
            let component = new AuthenticatedApp(props);
            jest.spyOn(component, 'setState').mockImplementation(() => {});
            component._isMounted = true;
            component.props = props;

            await component.getAuth();

            expect(window.localStorage.__proto__.removeItem).toHaveBeenCalledTimes(2);
            expect(component.setState).toHaveBeenCalledWith({
                failed_login: true
            });
        });

        test('should not call setState if not mounted', async () => {
            jest.spyOn(window.localStorage.__proto__, 'removeItem');
            fetch.mockImplementationOnce(() => {
                return Promise.resolve({
                    json: () => Promise.resolve({}),
                })
            }).mockImplementationOnce(() => {
                return Promise.resolve({
                    json: () => Promise.reject({}),
                })
            });
            let component = new AuthenticatedApp(props);
            jest.spyOn(component, 'setState').mockImplementation(() => {});
            component.props = props;

            await component.getAuth();
            await component.getAuth();

            expect(window.localStorage.__proto__.removeItem).toHaveBeenCalledTimes(4);
            expect(component.setState).toHaveBeenCalledTimes(0);
        });
    });

    describe('getUsers', () => {
        const props = {
            location: {
                search: 'code=54vabs9d2sd1f08pk4bjmwyjpx3iju&scope=chat%3Aread+chat%3Aedit+moderation%3Aread'
            }
        }
        test('should call setState with broadcaster and list of mods', async () => {
            jest.spyOn(window.localStorage.__proto__, 'setItem');
            fetch.mockImplementationOnce(() => {
                return Promise.resolve({
                    json: () => Promise.resolve({
                        data: [{
                            id: '123456789',
                            login: 'sirfarewell'
                        }]
                    }),
                })
            }).mockImplementationOnce(() => {
                return Promise.resolve({
                    json: () => Promise.resolve({
                        data: [{
                            broadcaster_type: '',
                            created_at: '2019-11-18T00:47:34Z',
                            display_name: 'SirFarewell',
                            id: '123456789',
                            login: 'sirfarewell'
                        }, {
                            user_name: 'HerooftheSprites'
                        }],
                        pagination: {}
                    }),
                })
            });


            let component = new AuthenticatedApp(props);
            jest.spyOn(component, 'setState').mockImplementation(() => {});
            component._isMounted = true;
            component.props = props;

            await component.getUsers();

            expect(window.localStorage.__proto__.setItem).toHaveBeenCalledTimes(1);
            expect(component.setState).toHaveBeenCalledWith({
                username: 'sirfarewell',
                modList: ['heroofthesprites']
            });
        });
        test('should not call setState if not mounted', async () => {
            jest.spyOn(window.localStorage.__proto__, 'setItem');
            fetch.mockImplementationOnce(() => {
                return Promise.resolve({
                    json: () => Promise.resolve({
                        data: [{
                            id: '123456789',
                            login: 'sirfarewell'
                        }]
                    }),
                })
            }).mockImplementationOnce(() => {
                return Promise.resolve({
                    json: () => Promise.resolve({}),
                })
            });


            let component = new AuthenticatedApp(props);
            jest.spyOn(component, 'setState').mockImplementation(() => {});
            component.props = props;

            await component.getUsers();

            expect(window.localStorage.__proto__.setItem).toHaveBeenCalledTimes(1);
            expect(component.setState).toHaveBeenCalledTimes(0);
        });
    });

    describe('logOut', () => {
        const {location} = window;

        beforeAll(() => {
            delete window.location;
            window.location = {reload: jest.fn()};
        });

        afterAll(() => {
            window.location = location;
        });
        test('should log out of api and reload window', async () => {
            jest.spyOn(window.localStorage.__proto__, 'removeItem');
            fetch.mockImplementation(() => {
                return Promise.resolve({
                    json: () => Promise.resolve({}),
                })
            });
            let component = new AuthenticatedApp();
            await component.logOut();

            expect(window.localStorage.__proto__.removeItem).toHaveBeenCalledTimes(2);
            expect(window.location.reload).toHaveBeenCalled();
        });
    });

    describe('render', () => {
        test('should render with MainScreen', () => {
            const shallowRenderer = createRenderer();
            shallowRenderer.render(<AuthenticatedApp {...props} />);
            let instance = shallowRenderer.getMountedInstance();
            instance.setState({
                access_token: 'yadayadayada',
                failed_login: false,
                modList: [],
                username: 'sirgoosewell'
            });
            let component = shallowRenderer.getRenderOutput();
            expect(component.props.children.type).toBe(MainScreen);
            expect(component).toMatchSnapshot();
            shallowRenderer.unmount();
        });
        test('should render with Redirect on failed login', () => {
            const shallowRenderer = createRenderer();
            shallowRenderer.render(<AuthenticatedApp {...props} />);
            let instance = shallowRenderer.getMountedInstance();
            instance.setState({
                access_token: null,
                failed_login: true,
                username: null
            });
            let component = shallowRenderer.getRenderOutput();
            expect(component.type).toBe(Redirect);
            expect(component).toMatchSnapshot();
            shallowRenderer.unmount();
        });
        test('should render with null', () => {
            const shallowRenderer = createRenderer();
            shallowRenderer.render(<AuthenticatedApp {...props} />);
            let instance = shallowRenderer.getMountedInstance();
            instance.setState({
                access_token: null,
                failed_login: false,
                username: null
            });
            let component = shallowRenderer.getRenderOutput();
            expect(component.props.children).toBeUndefined();
            expect(component).toMatchSnapshot();
            shallowRenderer.unmount();
        });
    });
});

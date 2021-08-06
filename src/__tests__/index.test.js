import ReactDOM from 'react-dom';

jest.mock('react-dom', () => {
    const reactDOM = jest.requireActual('react-dom');
    return {
        ...reactDOM,
        render: jest.fn()
    };
});

describe('index', () => {
    describe('renderDOM', () => {
        test('should call ReactDOM.render', () => {
            require('../index');
            expect(ReactDOM.render).toHaveBeenCalled();
        });
    });
});

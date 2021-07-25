import * as webVitals from 'web-vitals';
import reportWebVitals from '../reportWebVitals';

describe('reportWebVitals', () => {
    let getCLSSpy: jest.SpyInstance;
    let getFIDSpy: jest.SpyInstance;
    let getFCPSpy: jest.SpyInstance;
    let getLCPSpy: jest.SpyInstance;
    let getTTFBSpy: jest.SpyInstance;

    beforeEach(() => {
        getCLSSpy = jest.spyOn(webVitals, 'getCLS');
        getFIDSpy = jest.spyOn(webVitals, 'getFID');
        getFCPSpy = jest.spyOn(webVitals, 'getFCP');
        getLCPSpy = jest.spyOn(webVitals, 'getLCP');
        getTTFBSpy = jest.spyOn(webVitals, 'getTTFB');
    });

    test('should not call web-vitals methods if onPerfEntry is not a function', () => {
        const onPerfEntry = {};

        reportWebVitals(onPerfEntry);

        expect(getCLSSpy).not.toBeCalled();
        expect(getFIDSpy).not.toBeCalled();
        expect(getFCPSpy).not.toBeCalled();
        expect(getLCPSpy).not.toBeCalled();
        expect(getTTFBSpy).not.toBeCalled();
    });

    test('should call web-vitals methods if onPerfEntry is a function', () => {
        function onPerfEntry() {}

        reportWebVitals(onPerfEntry);

        expect(getCLSSpy).toBeCalledTimes(1);
        expect(getFIDSpy).toBeCalledTimes(1);
        expect(getFCPSpy).toBeCalledTimes(1);
        expect(getLCPSpy).toBeCalledTimes(1);
        expect(getTTFBSpy).toBeCalledTimes(1);
        expect(getCLSSpy).toBeCalledWith(onPerfEntry);
        expect(getFIDSpy).toBeCalledWith(onPerfEntry);
        expect(getFCPSpy).toBeCalledWith(onPerfEntry);
        expect(getLCPSpy).toBeCalledWith(onPerfEntry);
        expect(getTTFBSpy).toBeCalledWith(onPerfEntry);
    });
});

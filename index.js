import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
export const getCurrentZone = (bps) => {
    const width = window.innerWidth;
    let outZone = bps.findIndex(bp => width < bp);
    if (outZone < 0)
        outZone = bps.length;
    return outZone - 1;
};
const getMqLists = (bps) => bps.map((bp, i) => {
    const nextBp = bps[i + 1];
    return window.matchMedia(`(min-width: ${bp}px) ${nextBp ? `and (max-width: ${nextBp - 1}px)` : ''}`);
});
export const ZoneContext = React.createContext(0);
export const useZone = () => useContext(ZoneContext);
// bootstrap default breakpoints
export const ZoneManager = ({ breakpoints = [576, 767, 991, 1199], defaultZone = 0, children }) => {
    const bps = [0, ...breakpoints];
    // SSR renders without calling `useEffect` hooks (thus falling back to `defaultZone`), that's
    // why we need to render with the `defaultZone` on the client first to re-hydrate the dom
    const [zone, setZone] = useState(defaultZone);
    useEffect(() => {
        setZone(getCurrentZone(bps));
        const listenerForZone = (i) => (e) => {
            if (!e.matches)
                return;
            setZone(i);
        };
        const listeners = [];
        const mqLists = getMqLists(bps);
        mqLists.forEach((mqList, i) => {
            const listener = listenerForZone(i);
            mqList.addListener(listener);
            listeners.push(listener);
        });
        return () => {
            mqLists.forEach((mqList, i) => mqList.removeListener(listeners[i]));
        };
    }, 
    // We use the whole bps array as deps. Using `[bps]` would re-execute `useEffect` on each render
    bps);
    return React.createElement(ZoneContext.Provider, { value: zone }, children);
};

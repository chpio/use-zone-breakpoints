import * as React from 'react';
declare type GetCurrentZone = (FullBreakpoints: number[]) => number;
export declare const getCurrentZone: GetCurrentZone;
export declare const ZoneContext: React.Context<number>;
export declare const useZone: () => number;
interface ZoneManagerProps {
    breakpoints?: number[];
    defaultZone?: number;
}
export declare const ZoneManager: React.FC<ZoneManagerProps>;
export {};

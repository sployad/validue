import 'reflect-metadata';
import { WatchOptions } from 'vue';
declare type PropertyValidatorFunction = {
    (path: string, validationFunction: Function[], options: WatchOptions): Function;
    (path: string, validationFunction?: Function[]): Function;
    (path: string, option?: WatchOptions): Function;
};
export declare function ErrorValidator(target: any, key: string, index: number): void;
export declare const PropertyValidator: PropertyValidatorFunction;
export declare function ActionValidator(group?: string[]): (target: any, key: string, descriptor: any) => any;
export {};

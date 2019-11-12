import 'reflect-metadata';
import { WatchOptions } from 'vue';
export declare function PropertyValidator(path: string, validationFunctions?: Function[], options?: WatchOptions): (target: any, name: string) => void;
export declare function ActionValidator(group?: string[]): (target: any, name: string, descriptor: any) => any;

import 'reflect-metadata';
import {createDecorator} from 'vue-class-component';
import {WatchOptions} from 'vue';
import {getMetadataStorage, ValidationError, Validator} from 'class-validator';
// @ts-ignore
import {ValidationExecutor} from 'class-validator/esm5/validation/ValidationExecutor';

type PropertyValidatorFunction = {
    (path: string, validationFunction: Function[], options: WatchOptions): Function
    (path: string, validationFunction?: Function[]): Function
    (path: string, option?: WatchOptions): Function
}
const validator = new Validator();
const errorMetadataKey = (key: string) => `__validation-errors_${key}_parameter_index`;
const propertyMetadataKey = 'property-validaton';

/*
 * * Validate component's fields use a Class-Validator
 * */
const validateFields = (ctx: any, target: any, groups: string[] = []) => {
    const executor = new ValidationExecutor(validator, {groups});
    executor.ignoreAsyncValidations = true;
    const validationErrors: ValidationError[] = [];
    executor.execute(ctx, target.constructor, validationErrors);
    return executor.stripEmptyErrors(validationErrors);
};

/*
 * * Parse and initialization a watcher's options {deep, immediate}
 * */
const getWatchOptions = (validationFunctionsOrWatchOptions?: Function[] | WatchOptions, options?: WatchOptions): WatchOptions => {
    let deep, immediate = false;
    if (options) {
        deep = options.deep || false;
        immediate = options.immediate || false;
    } else if (validationFunctionsOrWatchOptions && !Array.isArray(validationFunctionsOrWatchOptions)) {
        deep = validationFunctionsOrWatchOptions.deep || false;
        immediate = validationFunctionsOrWatchOptions.immediate || false;
    }
    return {deep, immediate};
};

/*
* * Init Vue Watcher and append new path for a component watcher
* */
const getVueWatcher = (componentOptions: any, path: string) => {
    if (typeof componentOptions.watch !== 'object') {
        componentOptions.watch = Object.create(null);
    }

    const watch: any = componentOptions.watch;

    if (typeof watch[path] === 'object' && !Array.isArray(watch[path])) {
        watch[path] = [watch[path]];
    } else if (typeof watch[path] === 'undefined') {
        watch[path] = [];
    }

    return watch;
};

/*
* * Decorate parameter in a method who decorated by @ActionValidator and write errors to the it
* */
export function ErrorValidator(target: any, key: string, index: number) {
    target[errorMetadataKey(key)] = index;
}

/*
* *  Decorate Field for write a errors and it works like Vue Watcher * *
* */
export const PropertyValidator: PropertyValidatorFunction = (path: string, validationFunctionsOrWatchOptions?: Function[] | WatchOptions, options?: WatchOptions) => {
    return (target: any, name: string) => {
        const metaProperty = Reflect.getMetadata(propertyMetadataKey, target) || {};
        if (!metaProperty.hasOwnProperty(path)) {
            metaProperty[path] = name;
        }
        Reflect.defineMetadata(propertyMetadataKey, metaProperty, target);

        if (Array.isArray(validationFunctionsOrWatchOptions)) {
            validationFunctionsOrWatchOptions.forEach((fn) => fn(target, path));
        }

        createDecorator((componentOptions, key) => {
            const {deep, immediate} = getWatchOptions(validationFunctionsOrWatchOptions, options);
            const watch = getVueWatcher(componentOptions, path);

            const targetValidationMetadatas = getMetadataStorage()
                .getTargetValidationMetadatas(target.constructor, target.constructor as string, undefined);

            targetValidationMetadatas.filter((item) => item.propertyName === path).forEach((meta) => {
                meta.groups = [...meta.groups || [], key];
            });

            const handler = function (this: any, val: any) {
                const errors = validateFields(this, target, [key]);
                let errorMessages = {};

                if (errors.length) {
                    errorMessages = errors.reduce((previousValue: any, value: any) => {
                        previousValue = {...previousValue, ...value.constraints};
                        return previousValue;
                    }, {});
                }

                this[key] = errorMessages;
            };

            watch[path].push({handler, deep, immediate});

        })(target, name);
    };
}

/*
* * Triggered on call a decorated method * *
* */
export function ActionValidator(group?: string[]) {
    return (target: any, key: string, descriptor: any) => {
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        var originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const indexOfParam = target[errorMetadataKey(key)];
            const metaProperty = Reflect.getMetadata(propertyMetadataKey, target);
            const errors = validateFields(this, target, group);
            const errorValidatorData: Object[] = [];
            if (errors.length) {
                errors.forEach((error: any) => {
                    this[metaProperty[error.property]] = this[metaProperty[error.property]] || {};
                    this[metaProperty[error.property]] = {...error.constraints, ...this[metaProperty[error.property]]};
                    errorValidatorData.push({[metaProperty[error.property]] : this[metaProperty[error.property]]});
                });
            }
            if (indexOfParam !== undefined) {
                args.splice(indexOfParam, 0, errorValidatorData);
            }
            return originalMethod.apply(this, args);
        };


        return descriptor;
    };
}

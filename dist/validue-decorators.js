import 'reflect-metadata';
import { createDecorator } from 'vue-class-component';
import { getMetadataStorage, Validator } from 'class-validator';
// @ts-ignore
import { ValidationExecutor } from 'class-validator/esm5/validation/ValidationExecutor';
const validator = new Validator();
const errorMetadataKey = (key) => `__validation-errors_${key}_parameter_index`;
const propertyMetadataKey = 'property-validaton';
/*
 * * Validate component's fields use a Class-Validator
 * */
const validateFields = (ctx, target, groups = []) => {
    const executor = new ValidationExecutor(validator, { groups });
    executor.ignoreAsyncValidations = true;
    const validationErrors = [];
    executor.execute(ctx, target.constructor, validationErrors);
    return executor.stripEmptyErrors(validationErrors);
};
/*
 * * Parse and initialization a watcher's options {deep, immediate}
 * */
const getWatchOptions = (validationFunctionsOrWatchOptions, options) => {
    let deep, immediate = false;
    if (options) {
        deep = options.deep || false;
        immediate = options.immediate || false;
    }
    else if (validationFunctionsOrWatchOptions && !Array.isArray(validationFunctionsOrWatchOptions)) {
        deep = validationFunctionsOrWatchOptions.deep || false;
        immediate = validationFunctionsOrWatchOptions.immediate || false;
    }
    return { deep, immediate };
};
/*
* * Init Vue Watcher and append new path for a component watcher
* */
const getVueWatcher = (componentOptions, path) => {
    if (typeof componentOptions.watch !== 'object') {
        componentOptions.watch = Object.create(null);
    }
    const watch = componentOptions.watch;
    if (typeof watch[path] === 'object' && !Array.isArray(watch[path])) {
        watch[path] = [watch[path]];
    }
    else if (typeof watch[path] === 'undefined') {
        watch[path] = [];
    }
    return watch;
};
/*
* * Decorate parameter in a method who decorated by @ActionValidator and write errors to the it
* */
export function ErrorValidator(target, key, index) {
    target[errorMetadataKey(key)] = index;
}
/*
* *  Decorate Field for write a errors and it works like Vue Watcher * *
* */
export const PropertyValidator = (path, validationFunctionsOrWatchOptions, options) => {
    return (target, name) => {
        const metaProperty = Reflect.getMetadata(propertyMetadataKey, target) || {};
        if (!metaProperty.hasOwnProperty(path)) {
            metaProperty[path] = name;
        }
        Reflect.defineMetadata(propertyMetadataKey, metaProperty, target);
        if (Array.isArray(validationFunctionsOrWatchOptions)) {
            validationFunctionsOrWatchOptions.forEach((fn) => fn(target, path));
        }
        createDecorator((componentOptions, key) => {
            const { deep, immediate } = getWatchOptions(validationFunctionsOrWatchOptions, options);
            const watch = getVueWatcher(componentOptions, path);
            const targetValidationMetadatas = getMetadataStorage()
                .getTargetValidationMetadatas(target.constructor, target.constructor, undefined);
            targetValidationMetadatas.filter((item) => item.propertyName === path).forEach((meta) => {
                meta.groups = [...meta.groups || [], key];
            });
            const handler = function (val) {
                const errors = validateFields(this, target, [key]);
                let errorMessages = {};
                if (errors.length) {
                    errorMessages = errors.reduce((previousValue, value) => {
                        previousValue = { ...previousValue, ...value.constraints };
                        return previousValue;
                    }, {});
                }
                this[key] = errorMessages;
            };
            watch[path].push({ handler, deep, immediate });
        })(target, name);
    };
};
/*
* * Triggered on call a decorated method * *
* */
export function ActionValidator(group) {
    return (target, key, descriptor) => {
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        var originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            const indexOfParam = target[errorMetadataKey(key)];
            const metaProperty = Reflect.getMetadata(propertyMetadataKey, target);
            const errors = validateFields(this, target, group);
            const errorValidatorData = [];
            if (errors.length) {
                errors.forEach((error) => {
                    this[metaProperty[error.property]] = this[metaProperty[error.property]] || {};
                    this[metaProperty[error.property]] = { ...error.constraints, ...this[metaProperty[error.property]] };
                    errorValidatorData.push({ [metaProperty[error.property]]: this[metaProperty[error.property]] });
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
//# sourceMappingURL=validue-decorators.js.map
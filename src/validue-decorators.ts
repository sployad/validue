import 'reflect-metadata';
import {createDecorator} from 'vue-class-component';
import {WatchOptions} from 'vue';
import {getFromContainer, MetadataStorage, ValidationError, Validator} from 'class-validator';
import {ValidationExecutor} from 'class-validator/validation/ValidationExecutor';
const validator = new Validator();

export function PropertyValidator(path: string, validationFunctions?: Function[], options: WatchOptions = {}) {
    return (target: any, name: string) => {
        const metaProperty = Reflect.getMetadata('property-validation', target) || {};
        metaProperty[path] = name;
        Reflect.defineMetadata('property-validation', metaProperty, target);

        validationFunctions = validationFunctions || [];

        validationFunctions.forEach((fun) => {
            fun(target, path);
        });

        createDecorator((componentOptions, key) => {
            const {deep = false, immediate = false} = options;

            if (typeof componentOptions.watch !== 'object') {
                componentOptions.watch = Object.create(null);
            }

            const watch: any = componentOptions.watch;

            if (typeof watch[path] === 'object' && !Array.isArray(watch[path])) {
                watch[path] = [watch[path]];
            } else if (typeof watch[path] === 'undefined') {
                watch[path] = [];
            }

            const targetValidationMetadatas = getFromContainer(MetadataStorage)
                .getTargetValidationMetadatas(target.constructor, target.constructor as string, undefined);

            targetValidationMetadatas.filter((item) => item.propertyName === path).forEach((meta) => {
                meta.groups = [...meta.groups || [], key];
            });

            const handler = function(this: any, val: any) {
                const executor = new ValidationExecutor(validator, {groups: [key]});
                executor.ignoreAsyncValidations = true;
                const validationErrors: ValidationError[] = [];
                executor.execute(this, target.constructor, validationErrors);
                const errors = executor.stripEmptyErrors(validationErrors);
                let errorMessages = {};

                if (errors.length) {
                    errorMessages = errors.reduce((previousValue: any, value) => {
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

export function ActionValidator(group?: string[]) {
    return (target: any, name: string, descriptor: any) => {

        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, name);
        }

        const originalMethod = descriptor.value;

        descriptor.value = function(...args: any[]) {
            const metaProperty = Reflect.getMetadata('property-validation', target);

            const executor = new ValidationExecutor(validator, {groups: group || []});
            executor.ignoreAsyncValidations = true;
            const validationErrors: ValidationError[] = [];
            executor.execute(this, target.constructor, validationErrors);
            const errors = executor.stripEmptyErrors(validationErrors);

            if (errors.length) {
                errors.forEach((error) => {
                    this[metaProperty[error.property]] =  this[metaProperty[error.property]] || {};
                    this[metaProperty[error.property]] = {...error.constraints, ...this[metaProperty[error.property]]};
                });
            }

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

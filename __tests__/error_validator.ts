import 'reflect-metadata';
import {Component, Vue} from 'vue-property-decorator';
import {ActionValidator, ErrorValidator, PropertyValidator} from '../src';
import {IsEmail, IsNotEmpty, Matches} from 'class-validator';
import {shallowMount, Wrapper} from '@vue/test-utils';
import {CreateElement} from 'vue';

const emailErrorMessage = 'Email has wrong format';
const isRequiredMessage = 'Field is required';
const passwordErrorMessage = 'Password has wrong format'

@Component({})
class Test extends Vue {

    @IsEmail({}, {message: emailErrorMessage, groups: ['reg']})
    email = '';

    @IsNotEmpty({message: isRequiredMessage, groups: ['auth']})
    username = '';

    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {message: passwordErrorMessage, groups: ['reg', 'auth']})
    password = '';

    @PropertyValidator('password')
    passwordErrors: any = {};

    @PropertyValidator('email')
    emailErrors: any = {};

    @PropertyValidator('username')
    usernameErrors: any = {};

    @ActionValidator(['auth'])
    auth(@ErrorValidator errors?: []) {
        return errors;
    }

    @ActionValidator(['reg'])
    reg(@ErrorValidator errors?: []) {
        return errors;
    }

    render(h: CreateElement) {
        return h('div');
    }
}

describe('Test Error Validator', () => {
    let wrapper: Wrapper<Test>;
    beforeEach(() => {
        wrapper = shallowMount(Test);
    });
    afterEach(() => {
        wrapper.destroy();
    })
    it('Write error only for "auth" group', async () => {
        expect(wrapper.vm.email).toBe('');
        expect(wrapper.vm.emailErrors.isEmail).toBeUndefined();

        expect(wrapper.vm.password).toBe('');
        expect(wrapper.vm.passwordErrors.matches).toBeUndefined();

        wrapper.vm.email = '123'
        const errors = wrapper.vm.reg() as [];
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.emailErrors.isEmail).toBe(emailErrorMessage);
        expect(wrapper.vm.passwordErrors.matches).toBe(passwordErrorMessage);
        expect(errors.length).toBe(2);
        expect(wrapper.vm.usernameErrors.isNotEmpty).toBeUndefined();
    });


    it('No errors with the right fields', async () => {
        expect(wrapper.vm.username).toBe('');
        expect(wrapper.vm.usernameErrors.isEmail).toBeUndefined();

        expect(wrapper.vm.password).toBe('');
        expect(wrapper.vm.passwordErrors.matches).toBeUndefined();

        wrapper.vm.username = 'sployad'
        wrapper.vm.password = 'pASS123WORD'
        const errors = wrapper.vm.auth() as [];
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.usernameErrors.isNotEmpty).toBeUndefined();
        expect(wrapper.vm.passwordErrors.matches).toBeUndefined();
        expect(errors.length).toBe(0);
    })
})

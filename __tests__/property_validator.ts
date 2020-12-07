import 'reflect-metadata';
import {Component, Vue} from 'vue-property-decorator';
import {PropertyValidator} from '../src';
import {IsEmail} from 'class-validator';
import {shallowMount, Wrapper} from '@vue/test-utils';
import {CreateElement} from 'vue';

const emailErrorMessage = 'Email has wrong format';

@Component({})
class Test extends Vue {
    @PropertyValidator('email')
    emailErrors: any = {};

    @IsEmail({}, {message: emailErrorMessage})
    email = '';

    render(h: CreateElement){
        return h('div');
    }
}

describe('Test property validator', ()=> {
    let wrapper: Wrapper<Test>;
    beforeEach(() => {
        wrapper = shallowMount(Test);
    });
    afterEach(()=>{
        wrapper.destroy();
    })
    it('Write error message in emailErrors.isEmail', async ()=> {
        expect(wrapper.vm.email).toBe('');
        expect(wrapper.vm.emailErrors.isEmail).toBeUndefined();
        wrapper.vm.email = '123';
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.emailErrors.isEmail).toBe(emailErrorMessage)
    });
    it('No error with the right email\'s format', async ()=> {
        expect(wrapper.vm.email).toBe('');
        expect(wrapper.vm.emailErrors.isEmail).toBeUndefined();
        wrapper.vm.email = 'test@test.com';
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.emailErrors.isEmail).toBeUndefined();
    })
})

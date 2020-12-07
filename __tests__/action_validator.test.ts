import 'reflect-metadata';
import App from '../example/src/App.vue';
import {shallowMount, Wrapper} from '@vue/test-utils';

describe('Test ActionValidator decorator', () => {
    let wrapper: Wrapper<App>;
    beforeEach(() => {
        wrapper = shallowMount(App);
    });
    afterEach(()=>{
        wrapper.destroy();
    })
    it('Write errors to classes fields by call an action method', async () => {
        const spy = jest.spyOn(wrapper.vm, 'reg');
        await wrapper.vm.$forceUpdate();

        const regButton = wrapper.find('#regButton');
        expect(regButton.exists()).toBe(true);

        expect(Object.keys(wrapper.vm.userErrors).length).toBe(0);
        regButton.trigger('click');
        expect(spy).toBeCalled();
        expect(Object.keys(wrapper.vm.userErrors).length).toBeGreaterThan(0);
    });

    it('Successful call an action method (without errors) ', async () => {
        const spy = jest.spyOn(wrapper.vm, 'reg');
        await wrapper.vm.$forceUpdate();

        const regButton = wrapper.find('#regButton');
        expect(regButton.exists()).toBe(true);

        const textFieldUser = wrapper.find('#user');
        expect(textFieldUser.exists()).toBe(true);

        textFieldUser.setValue('sployad');

        expect(Object.keys(wrapper.vm.userErrors).length).toBe(0);
        regButton.trigger('click');
        expect(spy).toBeCalled();
        expect(Object.keys(wrapper.vm.userErrors).length).toBe(0);
    })
})

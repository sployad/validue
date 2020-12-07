<template>
  <div id="app">
    <img alt="Validue logo" src="./assets/logo.png">
    <div class="example-form">
      <div class="example-form__title">
        <h3>Example Validue Form</h3>
      </div>
      <div class="example-form__field-wrap">
        <label for="firstName">Your First Name</label>
        <input v-model="firstName" type="text" id="firstName" placeholder="Write your first name">
        <p class="field-wrap__error" v-if="firstNameErrors.isNotEmpty || firstNameErrors.length">
          {{ firstNameErrors.isNotEmpty || firstNameErrors.length }} </p>
      </div>
      <div class="example-form__field-wrap">
        <label for="email">Your Email</label>
        <input v-model="email" type="text" id="email" placeholder="Write your email">
        <p class="field-wrap__error" v-if="emailErrors.isNotEmpty || emailErrors.isEmail">
          {{ emailErrors.isNotEmpty || emailErrors.isEmail }} </p>
      </div>
      <div class="example-form__field-wrap">
        <label for="email">Your Email</label>
        <input v-model="user" type="text" id="user" placeholder="Write your email">
        <p class="field-wrap__error" v-if="userErrors.isNotEmpty"> {{ userErrors.isNotEmpty }} </p>
      </div>
      <button id="authButton" @click="auth">Send</button>
      <button id="regButton" @click="reg">Reg</button>
    </div>
  </div>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {ActionValidator, ErrorValidator, PropertyValidator, IsNotEmpty, IsEmail} from '../../src/index';

@Component({})
export default class App extends Vue {

  @IsNotEmpty({message: 'Required field', groups: ['auth', 'reg']})
  firstName = '';

  @IsNotEmpty({message: 'Required field', groups: ['auth']})
  @IsEmail({}, {message: 'Wrong email address', groups: ['auth']})
  email = '';

  @PropertyValidator('firstName')
  firstNameErrors = {};

  @PropertyValidator('email')
  emailErrors = {};

  @ActionValidator(['auth'])
  auth(@ErrorValidator errors?: []) {
    console.log('auth errors  = ', errors);
  }

  @IsNotEmpty({message: 'Required', groups: ['reg']})
  user = '';

  @PropertyValidator('user')
  userErrors = {};

  @ActionValidator(['reg'])
  reg(@ErrorValidator errors?: []) {
    console.log('reg errors = ', errors)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 60px;
}

.example-form {
  border: 1px solid gray;
  padding: 2em;
  max-width: 350px;
  width: 100%;
}

.example-form__field-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1em;
}

.example-form__field-wrap input {
  margin-top: 1em;
  border: 1px solid gray;
  border-radius: 1em;
  padding: .5em 1em;
  outline: none;
}

.example-form__field-wrap input:focus {
  border: 1px solid black;
}

.example-form button {
  margin-top: 1em;
  background: #2c3e50;
  border: 1px solid white;
  color: white;
  border-radius: 1em;
  padding: .7em 3em;
  outline: none;
  cursor: pointer;
}

.example-form button:hover {
  border: 1px solid black;
  background: rgba(0, 0, 0, 0.3);
}

.field-wrap__error {
  color: #ff5252;
  margin: .5em 0 0;
}
</style>

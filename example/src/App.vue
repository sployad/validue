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
                <p class="field-wrap__error" v-if="firstNameErrors.isNotEmpty || firstNameErrors.length"> {{firstNameErrors.isNotEmpty || firstNameErrors.length}} </p>
            </div>
            <div class="example-form__field-wrap">
                <label for="email">Your Email</label>
                <input v-model="email" type="text" id="email" placeholder="Write your email">
                <p class="field-wrap__error" v-if="emailErrors.isNotEmpty || emailErrors.isEmail"> {{emailErrors.isNotEmpty || emailErrors.isEmail}} </p>
            </div>
          <button @click="send()">Send</button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {IsNotEmpty, IsEmail, Length} from "class-validator";
    import {ActionValidator, PropertyValidator} from "validue";

    @Component({})
    export default class App extends Vue {

        @IsNotEmpty({message: "Required field", groups: ['registration']})
        @Length(1, 10, {message: "Field more then 10 chars or less then 1 char", groups: ['registration']})
        firstName = "";

        @IsNotEmpty({message: "Required field", groups: ['registration']})
        @Length(1, 10, {message: "Field more then 10 chars or less then 1 char", groups: ['registration']})
        lastName = "";

        @PropertyValidator("firstName")
        firstNameErrors = {};

        @PropertyValidator("lastName")
        lastNameErrors = {};

        @IsNotEmpty({message: "Required field", groups: ['auth']})
        @IsEmail({}, {message: "Wrong email address", groups: ['auth']})
        email = "";

        @IsNotEmpty({message: "Required field", groups: ['auth']})
        @IsEmail({}, {message: "Wrong email address", groups: ['auth']})
        password = "";

        @PropertyValidator("email")
        emailErrors = {};

        @PropertyValidator("password")
        passwordErrors = {};

        @ActionValidator(['registration'])
        register(){
            //Will validate fields which have group 'registration'
        }

        @ActionValidator(['auth'])
        auth(){
            //Will validate fields which have group 'auth'
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

    .example-form{
        border: 1px solid gray;
        padding: 2em;
        max-width: 350px;
        width: 100%;
    }

    .example-form__field-wrap{
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

    .example-form__field-wrap input:focus{
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

    .example-form button:hover{
        border:  1px solid black;
        background: rgba(0, 0, 0, 0.3);
    }

    .field-wrap__error{
        color: #ff5252;
        margin: .5em 0 0;
    }
</style>

# ![enter image description here](https://github.com/sployad/validue/blob/master/example/src/assets/logo.png?raw=true)

This library is based on the "[class-validator](https://github.com/typestack/class-validator)"  library. It will help you easily validate your fields, forms and etc.. All you need to use is @PropertyValidator , @ErrorValidator, @ActionValidator decorators,  and all decorators from “class validator” such as @Max, @IsEmail and etc..

# Instalation

    npm i validue


# Demo
Go to the link bellow for watch demo

> [Link demo on the codesandbox](https://codesandbox.io/s/headless-wave-1ri0c?file=/src/App.vue)

# Example

Validation errors check automatically because Validue create a Vue Watcher for watching field editing. This
example close to the real task, all you need to append for work it's a business logic in the SignUp method

```vue
<template>
  <form>
    <div class="text-field">
      <label class="text-field__label" for="username"> Your username </label>
      <input class="text-field__input" id="username" placeholder="Enter username">
      <p class="text-field__error" v-if="usernameErrors.isNotEmpty || usernameErrors.length">
        {{usernameErrors.isNotEmpty || usernameErrors.length}} 
      </p>
    </div>
    <div class="text-field">
      <label class="text-field__label" for="email"> Your email </label>
      <input class="text-field__input" id="email" placeholder="Enter email">
      <p class="text-field__error" v-if="emailErrors.isNotEmpty || emailErrors.isEmail">
        {{emailErrors.isNotEmpty || emailErrors.isEmail}}
      </p>
    </div>
    <button @click="signUp"> Sign up </button>
  </form>
</template>
<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {ActionValidator, PropertyValidator, ErrorValidator, IsNotEmpty, IsEmail, Length} from "validue";

@Component({})
export default class App extends Vue {

  @IsNotEmpty({message: "Required field"})
  @Length(1, 10, {message: "Field more then 10 chars or less then 1 char"})
  username = "";

  @IsNotEmpty({message: "Required field"})
  @IsEmail({}, {message: "Wrong email address"})
  email = "";

  @PropertyValidator("username")
  usernameErrors = {};

  @PropertyValidator("email")
  emailErrors = {};
  
  @ActionValidator()
  signUp(@ErrorValidator errors: []){
    if(errors.length){
      console.log('U have some errors');
      return;
    }
    //... your business logic
  }
}
</script>
```

## Usage
### @PropertyValidator has 3 override syntax:
#### PropertyValidator(path: string, validationFunctions?: Function[], options?: WatchOptions)
#### PropertyValidator(path: string, validationFunctions?:Function[])
#### PropertyValidator(path: string, options?: WatchOptions)


You need to add this decorator before the field, errors in which are written after validation. First argument is a field that is watched. It works like @Watch decorator in Vue. Second argument receives an array of validation functions. This argument is not required because you can use 2 methods to declare validation of your fields.

> All decorators of "class-validator" in  [here](https://github.com/typestack/class-validator#validation-decorators)

Example:
1 Way:
```typescript
    import {Component, Vue} from "vue-property-decorator";    
    import {ActionValidator, PropertyValidator,IsNotEmpty, IsEmail, Length} from "validue";  
      
    @Component({})  
    export default class App extends Vue {  
      
	    @IsNotEmpty({message: "Required field"})  
	    @Length(1, 10, {message: "Field more then 10 chars or less then 1 char"})  
	    firstName = "";  
  
	    @IsNotEmpty({message: "Required field"})  
	    @IsEmail({}, {message: "Wrong email address"})  
	    email = "";  
  
	    @PropertyValidator("firstName")  
	    firstNameErrors = {};  
  
	    @PropertyValidator("email")  
	    emailErrors = {};  
    }
```

2 Way:

 ```typescript	
   
    import {Component, Vue} from "vue-property-decorator";  
    import {ActionValidator, PropertyValidator,IsNotEmpty, IsEmail, Length} from "validue";  
      
    @Component({})  
    export default class App extends Vue {  
      
        firstName = "";  
        email = "";  
      
        @PropertyValidator("firstName", [  
            IsNotEmpty({message: "Required field"}),  
            Length(1, 10, {message: "Field more then 10 chars or less then 1 char"})  
        ])  
        firstNameErrors = {};  
      
        @PropertyValidator("email", [  
            IsNotEmpty({message: "Required field"}),  
            IsEmail({}, {message: "Wrong email address"})  
        ])  
        emailErrors = {};  
    }
```

### @ActionValidator(group?: string[])
This decorator is added before the method. Thus, before the method is called, all fields and field groups are validated, and returned errors are written in fields with @ProperyValidator added before.
Example without group:
```typescript
    import {Component, Vue} from "vue-property-decorator";  
    import {ActionValidator, PropertyValidator,IsNotEmpty, IsEmail, Length} from "validue";  
      
    @Component({})  
    export default class App extends Vue {  
      
        @IsNotEmpty({message: "Required field"})  
        @Length(1, 10, {message: "Field more then 10 chars or less then 1 char"})  
        firstName = "";  
      
        @IsNotEmpty({message: "Required field"})  
        @IsEmail({}, {message: "Wrong email address"})  
        email = "";  
      
        @PropertyValidator("firstName")  
        firstNameErrors = {};  
      
        @PropertyValidator("email")  
        emailErrors = {};  
      
        @ActionValidator()  
        send(){  
            console.log(this.firstNameErrors, this.emailErrors);  
        }  
    } 
```

Example with group:
```typescript
    import {Component, Vue} from "vue-property-decorator";  
    import {ActionValidator, PropertyValidator, IsNotEmpty, IsEmail, Length} from "validue";  
      
    @Component({})  
    export default class App extends Vue {  
      
        @IsNotEmpty({message: "Required field",
        groups: ['registration']})  
        @Length(1, 10, {message: "Field more then 10 chars or less then 1 char", 
        groups: ['registration']})  
        firstName = "";  
      
        @IsNotEmpty({message: "Required field", 
        groups: ['registration']})  
        @Length(1, 10, {message: "Field more then 10 chars or less then 1 char", 
        groups: ['registration']})  
        lastName = "";  
      
        @PropertyValidator("firstName")  
        firstNameErrors = {};  
      
        @PropertyValidator("lastName")  
        lastNameErrors = {};  
      
        @IsNotEmpty({message: "Required field", 
        groups: ['auth']})  
        @IsEmail({}, {message: "Wrong email address", groups: ['auth']})  
        email = "";  
      
        @IsNotEmpty({message: "Required field", 
        groups: ['auth']})  
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
```

> All decorators of "class-validator" in  [here](https://github.com/typestack/class-validator#validation-decorators)

Example:
1 Way:
```typescript
    import {Component, Vue} from "vue-property-decorator";  
    import {ActionValidator, PropertyValidator, IsNotEmpty, IsEmail, Length} from "validue";  
      
    @Component({})  
    export default class App extends Vue {  
      
	    @IsNotEmpty({message: "Required field"})  
	    @Length(1, 10, {message: "Field more then 10 chars or less then 1 char"})  
	    firstName = "";  
  
	    @IsNotEmpty({message: "Required field"})  
	    @IsEmail({}, {message: "Wrong email address"})  
	    email = "";  
  
	    @PropertyValidator("firstName")  
	    firstNameErrors = {};  
  
	    @PropertyValidator("email")  
	    emailErrors = {};  
    }
```

2 Way:

 ```typescript	
   
    import {Component, Vue} from "vue-property-decorator";  
    import {ActionValidator, PropertyValidator, IsNotEmpty, IsEmail, Length} from "validue";  
      
    @Component({})  
    export default class App extends Vue {  
      
        firstName = "";  
        email = "";  
      
        @PropertyValidator("firstName", [  
            IsNotEmpty({message: "Required field"}),  
            Length(1, 10, {message: "Field more then 10 chars or less then 1 char"})  
        ])  
        firstNameErrors = {};  
      
        @PropertyValidator("email", [  
            IsNotEmpty({message: "Required field"}),  
            IsEmail({}, {message: "Wrong email address"})  
        ])  
        emailErrors = {};  
    }
```

### @ActionValidator(group?: string[])
This decorator is added before the method. Thus, before the method is called, all fields and field groups are validated, and returned errors are written in fields with @ProperyValidator added before.
Example without group:
```typescript
    import {Component, Vue} from "vue-property-decorator";   
    import {ActionValidator, PropertyValidator, IsNotEmpty, IsEmail, Length} from "validue";  
      
    @Component({})  
    export default class App extends Vue {  
      
        @IsNotEmpty({message: "Required field"})  
        @Length(1, 10, {message: "Field more then 10 chars or less then 1 char"})  
        firstName = "";  
      
        @IsNotEmpty({message: "Required field"})  
        @IsEmail({}, {message: "Wrong email address"})  
        email = "";  
      
        @PropertyValidator("firstName")  
        firstNameErrors = {};  
      
        @PropertyValidator("email")  
        emailErrors = {};  
      
        @ActionValidator()  
        send(){  
            console.log(this.firstNameErrors, this.emailErrors);  
        }  
    } 
```

Example with group:
```typescript
    import {Component, Vue} from "vue-property-decorator";
import {ActionValidator, PropertyValidator, IsNotEmpty, IsEmail, Length} from "validue";

@Component({})
export default class App extends Vue {

    @IsNotEmpty({message: "Required field",
        groups: ['registration']})
    @Length(1, 10, {message: "Field more then 10 chars or less then 1 char",
        groups: ['registration']})
    firstName = "";

    @IsNotEmpty({message: "Required field",
        groups: ['registration']})
    @Length(1, 10, {message: "Field more then 10 chars or less then 1 char",
        groups: ['registration']})
    lastName = "";

    @PropertyValidator("firstName")
    firstNameErrors = {};

    @PropertyValidator("lastName")
    lastNameErrors = {};

    @IsNotEmpty({message: "Required field",
        groups: ['auth']})
    @IsEmail({}, {message: "Wrong email address", groups: ['auth']})
    email = "";

    @IsNotEmpty({message: "Required field",
        groups: ['auth']})
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
```

### @ErrorValidator paramName
This decorator is added in method's param and after call the method in this variable will write all need errors ('need' cuz u can use  Groups, see upper)

```typescript
import {Component, Vue} from "vue-property-decorator";
import {ActionValidator, PropertyValidator, IsNotEmpty, IsEmail, Length} from "validue";
import {ErrorValidator} from './validue-decorators';

@Component({})
export default class App extends Vue {

    @IsNotEmpty({message: "Required field"})
    @Length(1, 10, {message: "Field more then 10 chars or less then 1 char"})
    firstName = "";

    @IsNotEmpty({message: "Required field"})
    @IsEmail({}, {message: "Wrong email address"})
    email = "";

    @PropertyValidator("firstName")
    firstNameErrors = {};

    @PropertyValidator("email")
    emailErrors = {};

    @ActionValidator()
    send(@ErrorValidator errors) {
        console.log(errors) // errors = [ {firstNameErrors: {...errors-here...}}, {emailErrors: {...errors-here...}}]
    }
} 
```

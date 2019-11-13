# ![enter image description here](https://github.com/sployad/validue/blob/master/example/src/assets/logo.png?raw=true)

This library is based on the \"[class-validator\"](https://github.com/typestack/class-validator)  library. It will help you easily validate your fields, forms and etc.. All you need to use is @PropertyValidate and @ActionValidate decorators, and all decorators from “class validator” such as @Max, @IsEmail and etc..

# Instalation

    npm i validue

## Usage
#### @PropertyValidator(path: string, validationFunctions?: Function[]):


You need to add this decorator before the field, errors in which are written after validation. First argument is a field that is watched. It works like @Watch decorator in Vue. Second argument receives an array of validation functions. This argument is not required because you can use 2 methods to declare validation of your fields.

> All decorators of "class-validator" in  [here](https://github.com/typestack/class-validator#validation-decorators)

Example:
1 Way:
```typescript
    import {Component, Vue} from "vue-property-decorator";  
    import {IsNotEmpty, IsEmail, Length} from "class-validator";  
    import {ActionValidator, PropertyValidator} from "validue";  
      
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
    import {IsNotEmpty, IsEmail, Length} from "class-validator";  
    import {ActionValidator, PropertyValidator} from "validue";  
      
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
    import {IsNotEmpty, IsEmail, Length} from "class-validator";  
    import {ActionValidator, PropertyValidator} from "validue";  
      
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
    import {IsNotEmpty, IsEmail, Length} from "class-validator";  
    import {ActionValidator, PropertyValidator} from "validue";  
      
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

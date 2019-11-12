# ![enter image description here](https://github.com/sployad/validue/blob/master/example/src/assets/logo.png?raw=true)

This library based on \"[class-validator\"](https://github.com/typestack/class-validator) , it will help to easy you validate your fields, forms and etc. All you need to use decorators @PropertyValidate, @ActionValidate and all decorators from \"class-validator\" like @Max, @IsEmail and more...


# Instalation

    npm i validue

## Usage
#### @PropertyValidator(path: string, validationFunctions?: Function[]):


You need to add this decorator over a field, in which will be append errors after validation. First argument is what field will watch, it work like @Watch decorator in Vue. Second argument is not required , it is array of valiadtion functions, because you can use 2 ways of declaration validation your field.

> All decorators of "class-validator" in  [here](https://github.com/typestack/class-validator#validation-decorators)

Example:
1 Way:

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

2 Way:
	

     
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

### @ActionValidator(group?: string[])
This decorator you need add over a method, before call this method will be validate all fields or fields group and append errors to fields over which you added @PropertyValidator
Example without group: 

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
Example with group:

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

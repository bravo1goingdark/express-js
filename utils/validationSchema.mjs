// creating validation schema to validate post http request

export const createPostUserValidationSchema = {
    username:{
        isLength:{
            options:{
                min:5,
                max:32
            },
            errorMessage: "must be at least 5-32 characters"
        },
        isString:{
            errorMessage: "Must be a String"
        },
        notEmpty:{
            errorMessage:"Value must not be empty"
        }
    },
    displayName:{
        isString:{
            errorMessage: "Must be a String"
        },
        notEmpty:{
            errorMessage:"Value must not be empty"
        }
    },
    // added after db-08.mjs
    password:{
        notEmpty:true
    }
};
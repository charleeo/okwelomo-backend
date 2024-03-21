export const DEVELOPMENT = 'development';
export const TEST = 'test';
export const PRODUCTION = 'production'
export const USER_REPOSITORY = 'USER_REPOSITORY'
export const ADMIN_REPOSITORY = 'ADMIN_REPOSITORY'
export const ALLDUTIES = 'all'
export const NOTASSIGNED = 'non'
export const NOACTIONASSIGNED = 'no_action_assigned'
export const ADMINROLES:String[] = [
    "super_admin","gmd","tech_admin"
]


// checks if a password has at least one uppercase letter and a number or special character
export const PASSWORD_REGEX =
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

// checks if a string has only letters, numbers, spaces, apostrophes, dots and dashes
export const NAME_REGEX = /(^[\p{L}\d'\.\s\-]*$)/u;

// checks if a string is a valid slug, useful for usernames
export const SLUG_REGEX = /^[a-z\d]+(?:(\.|-|_)[a-z\d]+)*$/;

// validates if passwords are valid bcrypt hashes
export const BCRYPT_HASH = /\$2[abxy]?\$\d{1,2}\$[A-Za-z\d\./]{53}/;
export const SINGLE_NAME_REGEX = /^[^\s]+$/;
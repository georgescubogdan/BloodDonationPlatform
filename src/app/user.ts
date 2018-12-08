export interface Roles {
    user: boolean;
    doctor?: boolean;
    nurse?:  boolean;
}

export class User {
    email:    string;
    photoURL: string;
    roles:    Roles;
    
    constructor(authData) {
        this.email    = authData.email
        this.photoURL = authData.photoURL
        this.roles    = { user: true }
    }
}

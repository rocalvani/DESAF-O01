export default class UserDTO {
    constructor(user){
        this.name = user.first_name;
        this.last = user.last_name;
        this.user = `${this.name} ${this.last}`
        this.email = user.email;
        this.age = user.age
    }
}
export default class UserDTO {
    constructor(user){
        this.name = user.name;
        this.last = user.last;
        this.user = `${this.name} - ${this.last}`
    }
}
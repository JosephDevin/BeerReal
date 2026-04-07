export class Achievement {
    constructor(id, name, description, unlocked = false) {
        this.id          = id;
        this.name        = name;
        this.description = description;
        this.unlocked    = unlocked === true || unlocked === 'true';
    }
}

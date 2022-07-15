export default class Serializable {
    constructor(options) {
        this.serialize = options.serialize;
        this.deserialize = options.deserialize;
    }
    serializeArray(value) {
        return (value || []).map(this.serialize);
    }
    deserializeArray(data) {
        return data.map(this.deserialize);
    }
}
//# sourceMappingURL=serializable.js.map
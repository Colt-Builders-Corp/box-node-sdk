export default class Serializable<T> {
    constructor(options: {
        serialize: (value: T) => any;
        deserialize: (data: any) => T;
    });
    readonly serialize: (value: T | undefined) => any;
    readonly deserialize: (data: any) => T;
    serializeArray(value: T[] | undefined): any[];
    deserializeArray(data: any[]): T[];
}

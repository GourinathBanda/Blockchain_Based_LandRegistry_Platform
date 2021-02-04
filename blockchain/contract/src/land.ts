import { State } from './ledger-api/state';

interface IOwner {
    khataNo: Number;
    name: String;
}

interface IPoint {
    lat: Number;
    long: Number;
}

interface ILand {
    khasraNo: String;
    village: String;
    subDistrict: String;
    district: String;
    state: String;
    polygonPoints: Array<IPoint>;
    area: Number;
    owner: IOwner;
}

export class Land extends State {
    private khasraNo: String;
    private village: String;
    private subDistrict: String;
    private state: String;
    private polygonPoints: Array<IPoint>;
    private area: Number;
    private owner: IOwner;

    constructor(obj: ILand) {
        super(Land.getClass(), [
            obj.khasraNo,
            obj.village,
            obj.subDistrict,
            obj.district,
            obj.state,
        ]);
        Object.assign(this, obj);
    }

    getOwner() {
        return this.owner;
    }

    setOwner(owner: IOwner) {
        this.owner = owner;
    }

    static fromBuffer(buffer: Buffer) {
        return Land.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data: Buffer) {
        return State.deserializeClass(data, Land);
    }

    static getClass() {
        return 'landRecord';
    }
}

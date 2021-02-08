import { State } from './ledger-api/state';

export interface IOwner {
    khataNo: Number;
    name: String;
}

export interface IPoint {
    lat: Number;
    long: Number;
}

export interface ILand {
    khasraNo: String;
    village: String;
    subDistrict: String;
    district: String;
    state: String;
    polygonPoints: Array<IPoint>;
    area: Number;
    owner: IOwner;
    parentLandKey: String;
    expired: Boolean;
}

export class Land extends State {
    private khasraNo: String;
    private village: String;
    private subDistrict: String;
    private state: String;
    private polygonPoints: Array<IPoint>;
    private area: Number;
    private owner: IOwner;
    private parentLandKey: String;
    private expired: Boolean;

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

    isExpired() {
        return this.expired;
    }

    setExpired() {
        this.expired = true;
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

    static createInstance(
        khasraNo: String,
        village: String,
        subDistrict: String,
        district: String,
        state: String,
        polygonPoints: Array<IPoint>,
        area: Number,
        owner: IOwner,
        parentLandKey: String | null = null,
        expired: Boolean = false,
    ) {
        return new Land({
            khasraNo,
            village,
            subDistrict,
            district,
            state,
            polygonPoints,
            area,
            owner,
            parentLandKey,
            expired,
        });
    }
}

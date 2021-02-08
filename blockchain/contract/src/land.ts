import { State } from './ledger-api/state';

export interface IOwner {
    khataNo: Number;
    name: string;
}

export interface IPoint {
    lat: Number;
    long: Number;
}

export interface ILand {
    khasraNo: string;
    village: string;
    subDistrict: string;
    district: string;
    state: string;
    polygonPoints: Array<IPoint>;
    area: Number;
    owner: IOwner;
    parentLandKey: string;
    expired: Boolean;
}

export class Land extends State {
    private khasraNo: string;
    private village: string;
    private subDistrict: string;
    private state: string;
    private polygonPoints: Array<IPoint>;
    private area: Number;
    private owner: IOwner;
    private parentLandKey: string;
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
        khasraNo: string,
        village: string,
        subDistrict: string,
        district: string,
        state: string,
        polygonPoints: Array<IPoint>,
        area: Number,
        owner: IOwner,
        parentLandKey: string | null = null,
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

import { Contract, Context } from 'fabric-contract-api';
import { IPoint, IOwner, Land } from './land';
import { LandList } from './landlist';

class LandContext extends Context {
    public landList: LandList;

    constructor() {
        super();
        this.landList = new LandList(this);
    }
}

class LandContract extends Contract {
    constructor() {
        super('landContract');
    }

    createContext() {
        return new LandContext();
    }

    async createLand(
        ctx: LandContext,
        khasraNo: String,
        village: String,
        subDistrict: String,
        district: String,
        state: String,
        polygonPoints: Array<IPoint>,
        area: Number,
        khataNo: Number,
        ownerName: String,
    ) {
        let owner: IOwner = { khataNo: khataNo, name: ownerName };

        let land: Land = Land.createInstance(
            khasraNo,
            village,
            subDistrict,
            district,
            state,
            polygonPoints,
            area,
            owner,
        );

        await ctx.landList.addLand(land);

        return land;
    }

    async transferLand(
        ctx: LandContext,
        khasraNo: String,
        village: String,
        subDistrict: String,
        district: String,
        state: String,
        currentKhataNo: Number,
        currentOwnerName: String,
        newKhataNo: Number,
        newOwnerName: String,
        price: Number,
        transferDataTime: Date,
    ) {
        let landKey = Land.makeKey([
            khasraNo,
            village,
            subDistrict,
            district,
            village,
        ]);

        let land: Land = await ctx.landList.getLand(landKey);
        let currentOwner: IOwner = {
            khataNo: currentKhataNo,
            name: currentOwnerName,
        };

        if (land.getOwner() !== currentOwner) {
            throw new Error('\nLand is not owned by ' + currentOwnerName);
        }

        let newOwner: IOwner = {
            khataNo: newKhataNo,
            name: newOwnerName,
        };

        land.setOwner(newOwner);

        await ctx.landList.updateLand(land);
        return land;
    }
}

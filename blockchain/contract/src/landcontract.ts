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
            state,
        ]);

        let land: Land = await ctx.landList.getLand(landKey);
        let currentOwner: IOwner = {
            khataNo: currentKhataNo,
            name: currentOwnerName,
        };

        if (land.isExpired()) {
            throw new Error('\nCannot split land, land record is expired');
        }

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

    async splitLand(
        ctx: LandContext,
        khasraNo: String,
        village: String,
        subDistrict: String,
        district: String,
        state: String,
        newKhasraNoA: String,
        newPolygonPointsA: Array<IPoint>,
        areaA: Number,
        newKhasraNoB: String,
        newPolygonPointsB: Array<IPoint>,
        areaB: Number,
    ) {
        let landKey = Land.makeKey([
            khasraNo,
            village,
            subDistrict,
            district,
            state,
        ]);

        let land: Land = await ctx.landList.getLand(landKey);

        if (land.isExpired()) {
            throw new Error('\nCannot split land, land record is expired');
        }

        land.setExpired();

        let landA: Land = Land.createInstance(
            newKhasraNoA,
            village,
            subDistrict,
            district,
            state,
            newPolygonPointsA,
            areaA,
            land.getOwner(),
            landKey,
        );

        let landB: Land = Land.createInstance(
            newKhasraNoB,
            village,
            subDistrict,
            district,
            state,
            newPolygonPointsB,
            areaB,
            land.getOwner(),
            landKey,
        );

        await ctx.landList.updateLand(land);
        await ctx.landList.addLand(landA);
        await ctx.landList.addLand(landB);

        return [landA, landB];
    }
}

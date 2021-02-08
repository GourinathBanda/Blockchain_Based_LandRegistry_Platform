import { Contract, Context } from 'fabric-contract-api';
import { IPoint, IOwner, Land } from './land';
import { LandList } from './landlist';
import { QueryUtils } from './queryutils';
import { LISTNAME } from './constants';

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
        khasraNo: string,
        village: string,
        subDistrict: string,
        district: string,
        state: string,
        polygonPoints: Array<IPoint>,
        area: Number,
        khataNo: Number,
        ownerName: string,
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
        khasraNo: string,
        village: string,
        subDistrict: string,
        district: string,
        state: string,
        currentKhataNo: Number,
        currentOwnerName: string,
        newKhataNo: Number,
        newOwnerName: string,
        price: Number,
        transferDataTime: Date,
    ) {
        let landKey = Land.makeKey([
            state,
            district,
            subDistrict,
            village,
            khasraNo,
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
        khasraNo: string,
        village: string,
        subDistrict: string,
        district: string,
        state: string,
        newKhasraNoA: string,
        newPolygonPointsA: Array<IPoint>,
        areaA: Number,
        newKhasraNoB: string,
        newPolygonPointsB: Array<IPoint>,
        areaB: Number,
    ) {
        let landKey = Land.makeKey([
            state,
            district,
            subDistrict,
            village,
            khasraNo,
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

    async getOwnershipHistory(
        ctx: LandContext,
        khasraNo: string,
        village: string,
        subDistrict: string,
        district: string,
        state: string,
    ) {
        let query = new QueryUtils(ctx, LISTNAME);
        let results = await query.getAssetHistory(
            khasraNo,
            village,
            subDistrict,
            district,
            state,
        );
        return results;
    }

    async getAllRecordsInVillage(
        ctx: LandContext,
        village: string,
        subDistrict: string,
        district: string,
        state: string,
    ) {
        let query = new QueryUtils(ctx, LISTNAME);
        let results = await query.getAllRecordsByPartialKey([
            state,
            district,
            subDistrict,
            village,
        ]);
        return results;
    }
}

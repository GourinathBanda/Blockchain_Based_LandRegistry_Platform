import { StateList } from './ledger-api/statelist';
import { Land } from './land';
import { Context } from 'fabric-contract-api';

export class LandList extends StateList {
    constructor(ctx: Context) {
        super(ctx, 'landList');
        this.use(Land);
    }

    async addLand(land: Land) {
        return this.addState(land);
    }

    async getLand(landKey: String) {
        return this.getState(landKey);
    }

    async updateLand(land: Land) {
        return this.updateState(land);
    }
}

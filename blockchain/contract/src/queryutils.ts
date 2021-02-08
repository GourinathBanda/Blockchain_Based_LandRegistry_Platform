import { Context } from 'fabric-contract-api';
import { stat } from 'fs/promises';
import { Iterators } from 'fabric-shim-api';

export class QueryUtils {
    private ctx: Context;
    private name: string;

    constructor(ctx: Context, listName: string) {
        this.ctx = ctx;
        this.name = listName;
    }

    async getAssetHistory(
        khasraNo: string,
        village: string,
        subDistrict: string,
        district: string,
        state: string,
    ) {
        let ledgerKey = await this.ctx.stub.createCompositeKey(this.name, [
            khasraNo,
            village,
            subDistrict,
            district,
            state,
        ]);

        const resultsIterator = await this.ctx.stub.getHistoryForKey(ledgerKey);
        let results = await this.getAllResults(resultsIterator);
        return results;
    }

    async getAllRecordsByPartialKey(partialKey: Array<string>) {
        const resultsIterator = await this.ctx.stub.getStateByPartialCompositeKey(
            this.name,
            partialKey,
        );
        let results = await this.getAllResults(resultsIterator);
        return results;
    }

    async getAllResults(
        iterator:
            | Iterators.CommonIterator<Iterators.KeyModification>
            | Iterators.CommonIterator<Iterators.KV>,
    ) {
        let allResults: Array<any> = [];
        let res: { [key: string]: any } = { done: false, value: null };

        while (true) {
            res = await iterator.next();
            let jsonRes = {};
            if (res.value && res.value.value.toString()) {
                jsonRes = JSON.parse(res.value.value.toString('utf8'));
                allResults.push(jsonRes);
            }

            if (res.done) {
                await iterator.close();
                return allResults;
            }
        }
    }
}

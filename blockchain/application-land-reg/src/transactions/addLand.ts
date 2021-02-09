import { submitTransaction } from './submitTransaction';
import { IPoint } from '../../../contract/src/land';

export async function addLand(
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
    await submitTransaction('createLand', [
        khasraNo,
        village,
        subDistrict,
        district,
        state,
        polygonPoints,
        area,
        khataNo,
        ownerName,
    ]);
}

import inquirer from 'inquirer';
import { addLand } from '../transactions/addLand';
import { IPoint } from '../../../contract/src/land';

function validateEmpty() {
    return {
        validate: (input: string) => {
            if (!input || 0 === input.length) {
                return 'Input cannot be empty';
            }
            return true;
        },
    };
}

function validateNumbers() {
    return {
        validate: (input: string) => {
            const numberInput = Number(input);

            if (0 === input.length || isNaN(numberInput) || numberInput < 0) {
                return 'Enter a valid number';
            }

            return true;
        },
    };
}

export async function promptAddLand() {
    const quesListAddLand = [
        {
            name: 'khasraNo',
            message: 'Enter Khasra Number',
            ...validateEmpty(),
        },
        {
            name: 'village',
            message: 'Enter Village',
            ...validateEmpty(),
        },
        {
            name: 'subDistrict',
            message: 'Enter Sub-District',
            ...validateEmpty(),
        },
        {
            name: 'district',
            message: 'Enter District',
            ...validateEmpty(),
        },
        {
            name: 'state',
            message: 'Enter State',
            ...validateEmpty(),
        },
        {
            type: 'text',
            name: 'khatatNo',
            message: 'Enter Khata Number',
            ...validateNumbers(),
        },
        {
            name: 'owner',
            message: 'Enter Owner Name',
            ...validateEmpty(),
        },
        {
            type: 'text',
            name: 'area',
            message: 'Enter Area in sq m',
            ...validateNumbers(),
        },
        {
            type: 'text',
            name: 'numPts',
            message: 'Enter number of Polygon Points',
            ...validateNumbers(),
        },
    ];

    let results = await inquirer.prompt(quesListAddLand);

    let quesPolyPtsAr = [];
    for (let i = 0; i < Number(results.numPts); i++) {
        const quesPolyPts = [
            {
                type: 'text',
                name: 'lat' + i.toString(),
                message: 'Enter Latitude',
                ...validateNumbers(),
            },
            {
                type: 'text',
                name: 'long' + i.toString(),
                message: 'Enter Longitude',
                ...validateNumbers(),
            },
        ];
        quesPolyPtsAr.push(...quesPolyPts);
    }

    let ptsAnswers = await inquirer.prompt(quesPolyPtsAr);
    let pts: Array<IPoint> = [];

    for (let i = 0; i < Number(results.numPts); i++) {
        pts.push({
            lat: ptsAnswers['lat' + i.toString()],
            long: ptsAnswers['long' + i.toString()],
        });
    }

    console.log(pts);

    await addLand(
        results.khasraNo,
        results.village,
        results.subDistrict,
        results.district,
        results.state,
        pts,
        results.area,
        results.khatatNo,
        results.owner,
    );
}

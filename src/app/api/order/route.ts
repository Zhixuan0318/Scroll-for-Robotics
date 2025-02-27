import { NextRequest, NextResponse } from 'next/server';

import Contracts from '@/class/Contracts';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        if (!body.orderId) throw new Error('No order was provided');
        if (!body.stage) throw new Error('No stage was provided');

        if (body.stage == 1) {
            console.log('stage 1');
            await Contracts.processOrder(body.orderId);
            console.log('processed');
            await new Promise((resolve) => setTimeout(resolve, 4_000));
            await Contracts.generateRandomRobotId(body.orderId, 0);
            console.log('sent request');
        }

        if (body.stage == 2) {
            console.log('stage 2');
            await Contracts.pickOrder(body.orderId);
            console.log('picked');
            await new Promise((resolve) => setTimeout(resolve, 4_000));
            await Contracts.generateRandomRobotId(body.orderId, 1);
            console.log('sent request');
        }

        if (body.stage == 3) {
            console.log('stage 3');
            await Contracts.packOrder(body.orderId);
            console.log('packed');
            await new Promise((resolve) => setTimeout(resolve, 4_000));
            await Contracts.generateRandomRobotId(body.orderId, 2);
            console.log('sent request');
        }

        if (body.stage == 4) await Contracts.deliverOrder(body.orderId);

        console.log('end stage');
        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: `Error - ${error}` }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        if (body.productId == undefined) throw new Error('No product id');
        if (!body.ngrokUrl) throw new Error('No ngrokUrl');
        if (!body.stage) throw new Error('No stage');
        if (!body.orderId) throw new Error('No orderId');

        const color = body.productId == 0 ? 'green' : body.productId == 1 ? 'purple' : 'blue';

        await fetch(`${body.ngrokUrl}/api/scenario${body.stage - 1}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId: body.orderId,
                boxColour: color,
            }),
        });

        return NextResponse.json({}, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

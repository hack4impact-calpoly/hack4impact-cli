import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/User';
import { ApiWithIdParam } from '../../../../@types/types';

/* Get a model by its ID */
export async function GET(req: NextRequest, { params }: ApiWithIdParam) {
    const { id } = params;
    await dbConnect();
    try {
        const user = await User.findById(id);
        return NextResponse.json({ success: true, data: user });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}

/* Edit a model by its ID */
export async function PUT(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await dbConnect();
    try {
        const user = await User.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return NextResponse.json({ success: false }, { status: 400 });
        }
        return NextResponse.json({ success: true, data: user });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}

/* Delete a model by its ID */
export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await dbConnect();
    try {
        const deletedUser = await User.deleteOne({ _id: id });
        if (!deletedUser) {
            return NextResponse.json({ success: false }, { status: 400 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}

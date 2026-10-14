import { NextResponse } from "next/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { firstName, email, phone, address, message } = body;

        await resend.emails.send({
            from: 'Advanced Leads <info@contact.advancedteamelite.com>',
            to: process.env.NOTIFICATION_EMAIL || 'dtalledo@advancedteamelite.com',
            subject: `New Inspection Request: ${firstName}`,
            html: `
                <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
                    <h2 style="color: #00589e;">New Inspection Request</h2>
                    <p><strong>Name:</strong> ${firstName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Address:</strong> ${address}</p>
                    <p><strong>Additional Notes:</strong></p>
                    <p style="background: #f4f4f4; padding: 10px;">${message || 'No additional notes.'}</p>
                </div>
            `,
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
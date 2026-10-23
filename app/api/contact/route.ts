import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Escapa los datos del usuario antes de meterlos en el HTML del correo
const escapeHtml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        const phone = typeof body.phone === "string" ? body.phone.trim() : "";

        // Validación en el servidor: la del navegador se puede saltar
        const digits = phone.replace(/\D/g, "");
        if (
            firstName.length < 2 ||
            firstName.length > 60 ||
            !EMAIL_PATTERN.test(email) ||
            digits.length < 10 ||
            digits.length > 15
        ) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const safeName = escapeHtml(firstName);
        const safeEmail = escapeHtml(email);
        const safePhone = escapeHtml(phone);

        await resend.emails.send({
            from: "VCM <notifications@team.discovervcm.com>",
            to: process.env.NOTIFICATION_EMAIL || "dtalledo@advancedteamelite.com",
            replyTo: email,
            subject: `New VCM Contact Request: ${firstName}`,
            html: `
                <div style="background:#F0F0F0; padding:24px 0; font-family:Helvetica, Arial, sans-serif;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px; margin:0 auto; background:#171717; border-radius:16px; overflow:hidden;">
                        <tr>
                            <td style="padding:28px 32px; background:#171717;">
                                <span style="display:inline-block; font-size:24px; font-weight:bold; letter-spacing:1px; color:#FFFFFF;">VC<span style="color:#FEBD17;">M</span></span>
                                <div style="margin-top:4px; font-size:10px; letter-spacing:2px; color:#FFFFFF; opacity:0.6;">VIRTUAL CONSTRUCTION MANAGEMENT</div>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:4px; background:#FEBD17; line-height:4px; font-size:0;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="padding:32px; background:#FFFFFF;">
                                <h2 style="margin:0 0 8px; font-size:20px; color:#171717;">New VCM Contact Request</h2>
                                <p style="margin:0 0 24px; font-size:13px; color:#6B6355;">Submitted from the VCM landing page.</p>

                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size:14px; color:#171717;">
                                    <tr>
                                        <td style="padding:10px 0; border-bottom:1px solid #E7E2D8; width:120px; color:#6B6355;">Name</td>
                                        <td style="padding:10px 0; border-bottom:1px solid #E7E2D8; font-weight:bold;">${safeName}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:10px 0; border-bottom:1px solid #E7E2D8; color:#6B6355;">Email</td>
                                        <td style="padding:10px 0; border-bottom:1px solid #E7E2D8;"><a href="mailto:${safeEmail}" style="color:#171717; text-decoration:none;">${safeEmail}</a></td>
                                    </tr>
                                    <tr>
                                        <td style="padding:10px 0; border-bottom:1px solid #E7E2D8; color:#6B6355;">Phone</td>
                                        <td style="padding:10px 0; border-bottom:1px solid #E7E2D8;"><a href="tel:${safePhone}" style="color:#171717; text-decoration:none;">${safePhone}</a></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:18px 32px; background:#171717; font-size:11px; color:#FFFFFF; opacity:0.6;">
                                Automated notification — VCM
                            </td>
                        </tr>
                    </table>
                </div>
            `,
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
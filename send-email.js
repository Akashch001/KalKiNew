const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    const { to, from, subject, body, attachment, smtp } = JSON.parse(event.body);
    const { host, port, user, pass } = smtp;

    const transporter = nodemailer.createTransport({
        host: host,
        port: port,
        secure: port === 465, // true for 465, false for other ports (e.g., 587)
        auth: {
            user: user,
            pass: pass,
        },
    });

    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: body,
        attachments: attachment ? [{
            content: attachment.content,
            filename: attachment.filename,
            contentType: attachment.type,
        }] : [],
    };

    try {
        await transporter.sendMail(mailOptions);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Email sent to ${to} at 07:20 PM IST, June 26, 2025` }),
        };
    } catch (error) {
        console.error('SMTP error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rjay94410@gmail.com",
    pass: "rbis rpbb rgqz smlp",
  },
});

export const sendWelcomeEmail = async (to) => {
  await transporter.sendMail({
    from: `"Lumina Premium" <rjay94410@gmail.com>`,
    to,
    subject: "You're In. Welcome to the Inner Circle ✨",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9fafb; border-radius: 12px;">
        
        <h1 style="color: #111827; text-align: center;">
          Welcome to Lumina.
        </h1>

        <p style="font-size: 16px; color: #374151;">
          You didn’t just subscribe.
          <br /><br />
          You stepped inside the Inner Circle.
        </p>

        <p style="font-size: 15px; color: #4b5563;">
          Here’s what you can expect:
        </p>

        <ul style="font-size: 15px; color: #4b5563; line-height: 1.6;">
          <li>Early access to new drops</li>
          <li>Exclusive members-only offers</li>
          <li>Behind-the-scenes design insights</li>
          <li>Limited-time private sales</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <a 
            href="https://yourbrand.com/shop"
            style="
              background: #111827;
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 999px;
              font-weight: bold;
              display: inline-block;
            "
          >
            Explore the Collection
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

        <p style="font-size: 13px; color: #6b7280; text-align: center;">
          You’re receiving this email because you subscribed to Lumina.
          <br />
          If this wasn’t you, you can ignore this message.
        </p>

      </div>
    `,
  });
};

export const sendOfferEmail = async (to) => {
  await transporter.sendMail({
    from: `"Lumina Premium" <rjay94410@gmail.com>`,
    to,
    subject: "Exclusive Offer Just for You 🎁",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9fafb; border-radius: 12px;">
        
        <h1 style="color: #111827; text-align: center;">
          We Have Something Special for You
        </h1>

        <p style="font-size: 16px; color: #374151; text-align: center;">
          As one of our valued Inner Circle members, we wanted to share an <strong>exclusive offer</strong> tailored just for you.
        </p>

        <div style="background: #111827; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
          <p style="font-size: 14px; margin: 0 0 10px 0; opacity: 0.9;">LIMITED TIME OFFER</p>
          <h2 style="font-size: 32px; margin: 10px 0;">20% OFF</h2>
          <p style="font-size: 14px; margin: 10px 0 0 0; opacity: 0.9;">On Your Next Purchase</p>
        </div>

        <p style="font-size: 15px; color: #4b5563;">
          Use code: <strong style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px;">LUMINA20</strong>
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a 
            href="https://yourbrand.com/shop"
            style="
              background: #111827;
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 999px;
              font-weight: bold;
              display: inline-block;
            "
          >
            Shop Now & Save
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

        <p style="font-size: 13px; color: #6b7280; text-align: center;">
          This exclusive offer is only available to members of our Inner Circle.
          <br />
          Offer valid for 7 days.
        </p>

      </div>
    `,
  });
};

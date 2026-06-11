export function volunteerConfirmationEmail(firstName: string, volunteerId: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">
      
      <!-- Header -->
      <div style="background: #01381d; padding: 32px; text-align: center;">
        <h1 style="color: #ffffff; font-size: 32px; margin: 0; letter-spacing: 4px;">MAI</h1>
        <p style="color: #f97316; font-size: 11px; letter-spacing: 3px; margin: 6px 0 0; text-transform: uppercase;">Senatorial Campaign Organization</p>
        <p style="color: rgba(255,255,255,0.5); font-size: 11px; letter-spacing: 2px; margin: 4px 0 0; text-transform: uppercase;">Edo South 2027</p>
      </div>

      <!-- Body -->
      <div style="padding: 40px 32px; background: #ffffff;">
        <p style="color: #01381d; font-size: 11px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 8px;">Welcome to the Movement</p>
        <h2 style="color: #111; font-size: 24px; margin: 0 0 24px;">Dear ${firstName},</h2>

        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          Thank you for registering with the <strong>MAI Senatorial Campaign Organization</strong>.
        </p>
        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          We are delighted to welcome you to a growing community of individuals who believe in the vision of a stronger, more prosperous, and more inclusive Edo South.
        </p>
        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          Your registration has been successfully received and your profile has been created on our platform.
        </p>
        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          By joining this movement, you become part of a people-driven initiative committed to advancing development, effective representation, and meaningful engagement across Edo South Senatorial District.
        </p>
        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          We encourage you to stay connected for updates, community initiatives, events, volunteer opportunities, policy discussions, and other activities aimed at building a better future for our people.
        </p>
        <p style="color: #555; line-height: 1.8; margin: 0 0 32px;">
          Thank you for taking this important step and for believing in leadership founded on <strong>Experience, Capacity, and Genuine Commitment to the People.</strong>
        </p>

        <!-- Volunteer ID -->
        <div style="background: #f5f5f5; border-left: 4px solid #f97316; border-radius: 8px; padding: 20px 24px; margin: 0 0 32px;">
          <p style="margin: 0; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 2px;">Your Volunteer ID</p>
          <p style="margin: 8px 0 0; font-size: 28px; font-weight: 900; color: #f97316; letter-spacing: 2px;">${volunteerId}</p>
          <p style="margin: 8px 0 0; font-size: 12px; color: #888;">Keep this ID safe — you will need it to access your volunteer ID card.</p>
        </div>

        <!-- Download Button -->
        <div style="text-align: center; margin: 0 0 32px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/volunteer/card/${volunteerId.replace(/\//g, '-')}"
             style="display: inline-block; background: #f97316; color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
            Download Your ID Card
          </a>
          <p style="color: #aaa; font-size: 11px; margin: 12px 0 0;">Click the button above to view and download your volunteer ID card.</p>
        </div>

        <!-- Sign off -->
        <div style="border-top: 1px solid #e5e5e5; padding-top: 24px;">
          <p style="color: #555; line-height: 1.8; margin: 0 0 4px;">Together, we can make a difference.</p>
          <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">Warm regards,</p>
          <p style="color: #01381d; font-weight: bold; margin: 0; font-size: 14px;">MAI Senatorial Campaign Organization</p>
          <p style="color: #555; font-size: 13px; margin: 4px 0 0;">Hon. Mathew Aigbuhenze Iduoriyekemwen</p>
          <p style="color: #888; font-size: 12px; margin: 2px 0 0;">Senatorial Candidate, Edo South Senatorial District</p>
          <p style="color: #f97316; font-size: 12px; font-weight: bold; margin: 8px 0 0; letter-spacing: 2px; text-transform: uppercase;">The Time Is MAI</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #01381d; padding: 20px 32px; text-align: center;">
        <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin: 0;">
          © 2027 MAI Edo South Campaign. All Rights Reserved.<br/>
          55, Second East Circular Road, Benin City, Edo State, Nigeria.
        </p>
      </div>

    </div>
  `
}

export function volunteerAdminEmail(data: {
  firstName: string
  lastName: string
  email: string
  phone: string
  lga: string
  ward: string
  volunteerId: string
  volunteerAreas: string[]
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #01381d; padding: 24px;">
        <h2 style="color: #ffffff; margin: 0;">New Volunteer Application</h2>
        <p style="color: #f97316; margin: 4px 0 0; font-size: 12px; letter-spacing: 2px;">MAI EDO SOUTH 2027</p>
      </div>

      <div style="padding: 24px; background: #ffffff;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase; width: 40%;">Volunteer ID</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; font-weight: bold; color: #f97316;">${data.volunteerId}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">Name</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; font-weight: bold;">${data.firstName} ${data.lastName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">Email</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${data.email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">Phone</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${data.phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">LGA</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${data.lga}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">Ward</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${data.ward}</td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #888; font-size: 12px; text-transform: uppercase;">Areas of Service</td>
            <td style="padding: 10px;">${data.volunteerAreas.join(', ')}</td>
          </tr>
        </table>

        <div style="margin-top: 24px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/volunteers" 
             style="background: #01381d; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
            View in Dashboard
          </a>
        </div>
      </div>
    </div>
  `
}

export function feedbackConfirmationEmail(firstName: string, type: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #01381d; padding: 32px; text-align: center;">
        <h1 style="color: #ffffff; font-size: 28px; margin: 0;">MAI EDO SOUTH 2027</h1>
        <p style="color: #f97316; font-size: 12px; letter-spacing: 3px; margin-top: 8px;">SENATORIAL CAMPAIGN</p>
      </div>

      <div style="padding: 32px; background: #ffffff;">
        <h2 style="color: #01381d;">Thank you, ${firstName}!</h2>
        <p style="color: #555; line-height: 1.7;">
          Your ${type} has been received and taken under consideration. 
          Our team reviews all submissions and will follow up where necessary.
        </p>
        <p style="color: #555; line-height: 1.7;">
          We appreciate you taking the time to reach out. Your voice matters to us.
        </p>

        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e5e5;">
          <p style="color: #888; font-size: 12px; text-align: center;">
            © 2027 MAI Edo South Campaign. All Rights Reserved.<br/>
            55, Second East Circular Road, Benin City, Edo State.
          </p>
        </div>
      </div>
    </div>
  `
}

export function feedbackAdminEmail(data: {
  firstName: string
  lastName: string
  email: string
  phone?: string
  type: string
  subject: string
  message: string
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #01381d; padding: 24px;">
        <h2 style="color: #ffffff; margin: 0;">New ${data.type} Received</h2>
        <p style="color: #f97316; margin: 4px 0 0; font-size: 12px; letter-spacing: 2px;">MAI EDO SOUTH 2027</p>
      </div>

      <div style="padding: 24px; background: #ffffff;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase; width: 40%;">From</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; font-weight: bold;">${data.firstName} ${data.lastName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">Email</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${data.email}</td>
          </tr>
          ${data.phone ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">Phone</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${data.phone}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">Type</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; text-transform: capitalize;">${data.type}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">Subject</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${data.subject}</td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #888; font-size: 12px; text-transform: uppercase;">Message</td>
            <td style="padding: 10px; line-height: 1.7;">${data.message}</td>
          </tr>
        </table>

        <div style="margin-top: 24px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/feedback"
             style="background: #01381d; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
            View in Dashboard
          </a>
        </div>
      </div>
    </div>
  `
}

export function volunteerApprovalEmail(firstName: string, volunteerId: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">
      
      <!-- Header -->
      <div style="background: #01381d; padding: 32px; text-align: center;">
        <h1 style="color: #ffffff; font-size: 32px; margin: 0; letter-spacing: 4px;">MAI</h1>
        <p style="color: #f97316; font-size: 11px; letter-spacing: 3px; margin: 6px 0 0; text-transform: uppercase;">Senatorial Campaign Organization</p>
        <p style="color: rgba(255,255,255,0.5); font-size: 11px; letter-spacing: 2px; margin: 4px 0 0; text-transform: uppercase;">Edo South 2027</p>
      </div>

      <!-- Body -->
      <div style="padding: 40px 32px; background: #ffffff;">
        <div style="background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 8px; padding: 16px 20px; margin: 0 0 28px;">
          <p style="color: #16a34a; font-weight: bold; font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">✅ Application Approved</p>
        </div>

        <h2 style="color: #111; font-size: 24px; margin: 0 0 24px;">Dear ${firstName},</h2>

        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          We are pleased to inform you that your volunteer application with the <strong>MAI Senatorial Campaign Organization</strong> has been <strong style="color: #16a34a;">approved</strong>.
        </p>
        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          You are now an official volunteer of the MAI movement. Welcome to the team — we are excited to have you on board as we work together towards a stronger, more prosperous Edo South.
        </p>
        <p style="color: #555; line-height: 1.8; margin: 0 0 32px;">
          Your volunteer ID card is ready. Click the button below to view and download it. Please keep it safe as you will be required to present it at campaign events and activities.
        </p>

        <!-- Volunteer ID -->
        <div style="background: #f5f5f5; border-left: 4px solid #f97316; border-radius: 8px; padding: 20px 24px; margin: 0 0 32px;">
          <p style="margin: 0; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 2px;">Your Volunteer ID</p>
          <p style="margin: 8px 0 0; font-size: 28px; font-weight: 900; color: #f97316; letter-spacing: 2px;">${volunteerId}</p>
        </div>

        <!-- Download Button -->
        <div style="text-align: center; margin: 0 0 32px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/volunteer/card/${volunteerId.replace(/\//g, '-')}"
             style="display: inline-block; background: #01381d; color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
            Download Your ID Card
          </a>
        </div>

        <!-- Sign off -->
        <div style="border-top: 1px solid #e5e5e5; padding-top: 24px;">
          <p style="color: #555; line-height: 1.8; margin: 0 0 4px;">Together, we can make a difference.</p>
          <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">Warm regards,</p>
          <p style="color: #01381d; font-weight: bold; margin: 0; font-size: 14px;">MAI Senatorial Campaign Organization</p>
          <p style="color: #555; font-size: 13px; margin: 4px 0 0;">Hon. Mathew Aigbuhenze Iduoriyekemwen</p>
          <p style="color: #888; font-size: 12px; margin: 2px 0 0;">Senatorial Candidate, Edo South Senatorial District</p>
          <p style="color: #f97316; font-size: 12px; font-weight: bold; margin: 8px 0 0; letter-spacing: 2px; text-transform: uppercase;">The Time Is MAI</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #01381d; padding: 20px 32px; text-align: center;">
        <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin: 0;">
          © 2027 MAI Edo South Campaign. All Rights Reserved.<br/>
          55, Second East Circular Road, Benin City, Edo State, Nigeria.
        </p>
      </div>

    </div>
  `
}

export function volunteerRejectionEmail(firstName: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">
      
      <!-- Header -->
      <div style="background: #01381d; padding: 32px; text-align: center;">
        <h1 style="color: #ffffff; font-size: 32px; margin: 0; letter-spacing: 4px;">MAI</h1>
        <p style="color: #f97316; font-size: 11px; letter-spacing: 3px; margin: 6px 0 0; text-transform: uppercase;">Senatorial Campaign Organization</p>
        <p style="color: rgba(255,255,255,0.5); font-size: 11px; letter-spacing: 2px; margin: 4px 0 0; text-transform: uppercase;">Edo South 2027</p>
      </div>

      <!-- Body -->
      <div style="padding: 40px 32px; background: #ffffff;">
        <h2 style="color: #111; font-size: 24px; margin: 0 0 24px;">Dear ${firstName},</h2>

        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          Thank you for your interest in volunteering with the <strong>MAI Senatorial Campaign Organization</strong> and for the time you took to submit your application.
        </p>
        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          After careful review of all applications received, we regret to inform you that we are unable to onboard you as a volunteer at this time. This decision was not made lightly, and we sincerely appreciate the enthusiasm and commitment you have shown toward the movement.
        </p>
        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          We encourage you to remain connected with the MAI movement. Your support — in whatever capacity — is valued and appreciated. There will be other opportunities to contribute to the growth and success of Edo South.
        </p>
        <p style="color: #555; line-height: 1.8; margin: 0 0 32px;">
          We wish you all the best and hope to count on your continued support as we work together towards a stronger, more prosperous Edo South.
        </p>

        <!-- Sign off -->
        <div style="border-top: 1px solid #e5e5e5; padding-top: 24px;">
          <p style="color: #555; line-height: 1.8; margin: 0 0 4px;">Together, we can make a difference.</p>
          <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">Warm regards,</p>
          <p style="color: #01381d; font-weight: bold; margin: 0; font-size: 14px;">MAI Senatorial Campaign Organization</p>
          <p style="color: #555; font-size: 13px; margin: 4px 0 0;">Hon. Mathew Aigbuhenze Iduoriyekemwen</p>
          <p style="color: #888; font-size: 12px; margin: 2px 0 0;">Senatorial Candidate, Edo South Senatorial District</p>
          <p style="color: #f97316; font-size: 12px; font-weight: bold; margin: 8px 0 0; letter-spacing: 2px; text-transform: uppercase;">The Time Is MAI</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #01381d; padding: 20px 32px; text-align: center;">
        <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin: 0;">
          © 2027 MAI Edo South Campaign. All Rights Reserved.<br/>
          55, Second East Circular Road, Benin City, Edo State, Nigeria.
        </p>
      </div>

    </div>
  `
}
export function diasporaApprovalEmail(fullName: string, diasporaId: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">

      <!-- Header -->
      <div style="background: #01381d; padding: 32px; text-align: center;">
        <img src="https://www.mai4senate.com/image_4.png" alt="MAI Logo" style="height: 70px; width: auto; margin-bottom: 16px;" />
        <h1 style="color: #ffffff; font-size: 32px; margin: 0; letter-spacing: 4px;">MAI</h1>
        <p style="color: #f97316; font-size: 11px; letter-spacing: 3px; margin: 6px 0 0; text-transform: uppercase;">Diaspora Network</p>
        <p style="color: rgba(255,255,255,0.5); font-size: 11px; letter-spacing: 2px; margin: 4px 0 0; text-transform: uppercase;">Connecting Edo South To The World</p>
      </div>

      <!-- Body -->
      <div style="padding: 40px 32px; background: #ffffff;">
        <div style="background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 8px; padding: 16px 20px; margin: 0 0 28px;">
          <p style="color: #16a34a; font-weight: bold; font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">✅ Registration Approved</p>
        </div>

        <h2 style="color: #111; font-size: 24px; margin: 0 0 24px;">Dear ${fullName},</h2>

        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          We are pleased to inform you that your registration with the <strong>MAI Diaspora Network</strong> has been <strong style="color: #16a34a;">approved</strong>.
        </p>
        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          You are now an official member of the MAI Diaspora Network — a growing community of Edo South indigenes across the globe committed to the development of our homeland.
        </p>
        <p style="color: #555; line-height: 1.8; margin: 0 0 32px;">
          Your membership ID card is attached to this email. Please keep it safe as it identifies you as a registered member of the MAI Diaspora Network.
        </p>

        <!-- Member ID -->
        <div style="background: #f5f5f5; border-left: 4px solid #f97316; border-radius: 8px; padding: 20px 24px; margin: 0 0 32px;">
          <p style="margin: 0; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 2px;">Your Member ID</p>
          <p style="margin: 8px 0 0; font-size: 28px; font-weight: 900; color: #f97316; letter-spacing: 2px;">${diasporaId}</p>
        </div>

         <div style="text-align: center; margin: 0 0 32px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/diaspora/card/${diasporaId.replace(/\//g, '-')}"
             style="display: inline-block; background: #01381d; color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
            Download Your ID Card
          </a>
        </div>

        <!-- Sign off -->
        <div style="border-top: 1px solid #e5e5e5; padding-top: 24px;">
          <p style="color: #555; line-height: 1.8; margin: 0 0 4px;">Together, we can make a difference.</p>
          <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">Warm regards,</p>
          <p style="color: #01381d; font-weight: bold; margin: 0; font-size: 14px;">MAI Diaspora Network</p>
          <p style="color: #555; font-size: 13px; margin: 4px 0 0;">Hon. Mathew Aigbuhenze Iduoriyekemwen</p>
          <p style="color: #888; font-size: 12px; margin: 2px 0 0;">Senatorial Candidate, Edo South Senatorial District</p>
          <p style="color: #f97316; font-size: 12px; font-weight: bold; margin: 8px 0 0; letter-spacing: 2px; text-transform: uppercase;">The Time Is MAI</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #01381d; padding: 20px 32px; text-align: center;">
        <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin: 0;">
          © 2027 MAI Edo South Campaign. All Rights Reserved.<br/>
          55, Second East Circular Road, Benin City, Edo State, Nigeria.
        </p>
      </div>

    </div>
  `
}

export function diasporaRejectionEmail(fullName: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">

      <!-- Header -->
      <div style="background: #01381d; padding: 32px; text-align: center;">
        <img src="https://www.mai4senate.com/image_4.png" alt="MAI Logo" style="height: 70px; width: auto; margin-bottom: 16px;" />
        <h1 style="color: #ffffff; font-size: 32px; margin: 0; letter-spacing: 4px;">MAI</h1>
        <p style="color: #f97316; font-size: 11px; letter-spacing: 3px; margin: 6px 0 0; text-transform: uppercase;">Diaspora Network</p>
        <p style="color: rgba(255,255,255,0.5); font-size: 11px; letter-spacing: 2px; margin: 4px 0 0; text-transform: uppercase;">Connecting Edo South To The World</p>
      </div>

      <!-- Body -->
      <div style="padding: 40px 32px; background: #ffffff;">
        <h2 style="color: #111; font-size: 24px; margin: 0 0 24px;">Dear ${fullName},</h2>

        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          Thank you for your interest in joining the <strong>MAI Diaspora Network</strong> and for the time you took to complete your registration.
        </p>
        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          After careful review of all registrations received, we regret to inform you that we are unable to approve your membership at this time. We sincerely appreciate the enthusiasm and commitment you have shown towards the development of Edo South.
        </p>
        <p style="color: #555; line-height: 1.8; margin: 0 0 32px;">
          We encourage you to remain connected with the MAI movement. Your support — in whatever capacity — is valued and appreciated. There will be other opportunities to contribute to the growth and success of Edo South.
        </p>

        <!-- Sign off -->
        <div style="border-top: 1px solid #e5e5e5; padding-top: 24px;">
          <p style="color: #555; line-height: 1.8; margin: 0 0 4px;">Together, we can make a difference.</p>
          <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">Warm regards,</p>
          <p style="color: #01381d; font-weight: bold; margin: 0; font-size: 14px;">MAI Diaspora Network</p>
          <p style="color: #555; font-size: 13px; margin: 4px 0 0;">Hon. Mathew Aigbuhenze Iduoriyekemwen</p>
          <p style="color: #888; font-size: 12px; margin: 2px 0 0;">Senatorial Candidate, Edo South Senatorial District</p>
          <p style="color: #f97316; font-size: 12px; font-weight: bold; margin: 8px 0 0; letter-spacing: 2px; text-transform: uppercase;">The Time Is MAI</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #01381d; padding: 20px 32px; text-align: center;">
        <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin: 0;">
          © 2027 MAI Edo South Campaign. All Rights Reserved.<br/>
          55, Second East Circular Road, Benin City, Edo State, Nigeria.
        </p>
      </div>

    </div>
  `
}

export function maiListensAcknowledgementEmail(fullName: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">

      <!-- Header -->
      <div style="background: #01381d; padding: 32px; text-align: center;">
        <img src="https://www.mai4senate.com/image_4.png" alt="MAI Logo" style="height: 70px; width: auto; margin-bottom: 16px;" />
        <h1 style="color: #ffffff; font-size: 32px; margin: 0; letter-spacing: 4px;">MAI</h1>
        <p style="color: #f97316; font-size: 11px; letter-spacing: 3px; margin: 6px 0 0; text-transform: uppercase;">MAI Listens</p>
        <p style="color: rgba(255,255,255,0.5); font-size: 11px; letter-spacing: 2px; margin: 4px 0 0; text-transform: uppercase;">Your Voice Matters</p>
      </div>

      <!-- Body -->
      <div style="padding: 40px 32px; background: #ffffff;">
        <h2 style="color: #111; font-size: 24px; margin: 0 0 24px;">Dear ${fullName},</h2>

        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          Thank you for reaching out through the <strong>MAI Listens</strong> platform. Your feedback has been received and is currently under review by our team.
        </p>
        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          Your voice is important to us. Hon. Mathew Aigbuhenze Iduoriyekemwen is committed to identifying and addressing the key issues affecting communities across Edo South, and your submission helps us do exactly that.
        </p>
        <p style="color: #555; line-height: 1.8; margin: 0 0 32px;">
          We will follow up where necessary. Thank you for believing in a better Edo South.
        </p>

        <!-- Sign off -->
        <div style="border-top: 1px solid #e5e5e5; padding-top: 24px;">
          <p style="color: #555; line-height: 1.8; margin: 0 0 4px;">Together, we can make a difference.</p>
          <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">Warm regards,</p>
          <p style="color: #01381d; font-weight: bold; margin: 0; font-size: 14px;">MAI Senatorial Campaign Organization</p>
          <p style="color: #555; font-size: 13px; margin: 4px 0 0;">Hon. Mathew Aigbuhenze Iduoriyekemwen</p>
          <p style="color: #888; font-size: 12px; margin: 2px 0 0;">Senatorial Candidate, Edo South Senatorial District</p>
          <p style="color: #f97316; font-size: 12px; font-weight: bold; margin: 8px 0 0; letter-spacing: 2px; text-transform: uppercase;">The Time Is MAI</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #01381d; padding: 20px 32px; text-align: center;">
        <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin: 0;">
          © 2027 MAI Edo South Campaign. All Rights Reserved.<br/>
          55, Second East Circular Road, Benin City, Edo State, Nigeria.
        </p>
      </div>

    </div>
  `
}

export function maiListensAdminEmail(data: {
  fullName: string
  email?: string
  phone: string
  categories: string[]
  issue: string
  lga: string
  ward: string
  community: string
  priority: string
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">
      <div style="background: #01381d; padding: 24px;">
        <h2 style="color: #ffffff; margin: 0;">New MAI Listens Submission</h2>
        <p style="color: #f97316; margin: 4px 0 0; font-size: 12px; letter-spacing: 2px;">MAI EDO SOUTH 2027</p>
      </div>
      <div style="padding: 24px; background: #ffffff;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase; width: 40%;">From</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; font-weight: bold;">${data.fullName}</td>
          </tr>
          ${data.email ? `<tr><td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">Email</td><td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${data.email}</td></tr>` : ''}
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">Phone</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${data.phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">Location</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${data.community}, ${data.ward}, ${data.lga}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">Categories</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${data.categories?.join(', ')}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">Priority</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; font-weight: bold; color: #f97316;">${data.priority}</td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #888; font-size: 12px; text-transform: uppercase;">Issue</td>
            <td style="padding: 10px; line-height: 1.7;">${data.issue}</td>
          </tr>
        </table>
        <div style="margin-top: 24px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/mai-listens"
             style="background: #01381d; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
            View in Dashboard
          </a>
        </div>
      </div>
    </div>
  `
}

export function maiListensReplyEmail(fullName: string, reply: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">
      <div style="background: #01381d; padding: 32px; text-align: center;">
        <img src="https://www.mai4senate.com/image_4.png" alt="MAI Logo" style="height: 70px; width: auto; margin-bottom: 16px;" />
        <h1 style="color: #ffffff; font-size: 32px; margin: 0; letter-spacing: 4px;">MAI</h1>
        <p style="color: #f97316; font-size: 11px; letter-spacing: 3px; margin: 6px 0 0; text-transform: uppercase;">MAI Listens</p>
      </div>
      <div style="padding: 40px 32px; background: #ffffff;">
        <h2 style="color: #111; font-size: 24px; margin: 0 0 24px;">Dear ${fullName},</h2>
        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          Thank you for reaching out through MAI Listens. We have reviewed your submission and would like to share the following response:
        </p>
        <div style="background: #f5f5f5; border-left: 4px solid #01381d; border-radius: 8px; padding: 20px 24px; margin: 24px 0; line-height: 1.8; color: #333;">
          ${reply}
        </div>
        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          We remain committed to addressing the needs of our communities across Edo South. Thank you for your continued support.
        </p>
        <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-top: 32px;">
          <p style="color: #01381d; font-weight: bold; margin: 0; font-size: 14px;">MAI Senatorial Campaign Organization</p>
          <p style="color: #555; font-size: 13px; margin: 4px 0 0;">Hon. Mathew Aigbuhenze Iduoriyekemwen</p>
          <p style="color: #888; font-size: 12px; margin: 2px 0 0;">Senatorial Candidate, Edo South Senatorial District</p>
          <p style="color: #f97316; font-size: 12px; font-weight: bold; margin: 8px 0 0; letter-spacing: 2px; text-transform: uppercase;">The Time Is MAI</p>
        </div>
      </div>
      <div style="background: #01381d; padding: 20px 32px; text-align: center;">
        <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin: 0;">
          © 2027 MAI Edo South Campaign. All Rights Reserved.<br/>
          55, Second East Circular Road, Benin City, Edo State, Nigeria.
        </p>
      </div>
    </div>
  `
}

export function diasporaConfirmationEmail(fullName: string, memberId: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">
      
      <!-- Header -->
      <div style="background: #01381d; padding: 32px; text-align: center;">
        <h1 style="color: #ffffff; font-size: 32px; margin: 0; letter-spacing: 4px;">MAI</h1>
        <p style="color: #f97316; font-size: 11px; letter-spacing: 3px; margin: 6px 0 0; text-transform: uppercase;">MAI Diaspora Network</p>
        <p style="color: rgba(255,255,255,0.5); font-size: 11px; letter-spacing: 2px; margin: 4px 0 0; text-transform: uppercase;">Edo South 2027</p>
      </div>

      <!-- Body -->
      <div style="padding: 40px 32px; background: #ffffff;">
        <p style="color: #01381d; font-size: 11px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 8px;">MAI Diaspora Network</p>
        <h2 style="color: #111; font-size: 24px; margin: 0 0 24px;">Dear ${fullName},</h2>

        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          Thank you for registering with the <strong>MAI Diaspora Network</strong>.
        </p>
        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          We are delighted to welcome you to a growing community of individuals who believe in the vision of a stronger, more prosperous, and more inclusive Edo South.
        </p>
        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          Your registration has been successfully received and your profile has been created on our platform.
        </p>
        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          By joining this movement, you become part of a people-driven initiative committed to advancing development, effective representation, and meaningful engagement across MAI diaspora Network.
        </p>
        <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">
          We encourage you to stay connected for updates, community initiatives, events, volunteer opportunities, policy discussions, and other activities aimed at building a better future for our people.
        </p>
        <p style="color: #555; line-height: 1.8; margin: 0 0 32px;">
          Thank you for taking this important step and for believing in leadership founded on <strong>Experience, Capacity, and Genuine Commitment to the People.</strong>
        </p>

        <!-- Volunteer ID -->
        <div style="background: #f5f5f5; border-left: 4px solid #f97316; border-radius: 8px; padding: 20px 24px; margin: 0 0 32px;">
          <p style="margin: 0; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 2px;">Your Volunteer ID</p>
          <p style="margin: 8px 0 0; font-size: 28px; font-weight: 900; color: #f97316; letter-spacing: 2px;">${memberId}</p>
          <p style="margin: 8px 0 0; font-size: 12px; color: #888;">Keep this ID safe — you will need it to access your volunteer ID card.</p>
        </div>

        <!-- Download Button -->
        <div style="text-align: center; margin: 0 0 32px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/volunteer/card/${memberId.replace(/\//g, '-')}"
             style="display: inline-block; background: #f97316; color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
            Download Your ID Card
          </a>
          <p style="color: #aaa; font-size: 11px; margin: 12px 0 0;">Click the button above to view and download your volunteer ID card.</p>
        </div>

        <!-- Sign off -->
        <div style="border-top: 1px solid #e5e5e5; padding-top: 24px;">
          <p style="color: #555; line-height: 1.8; margin: 0 0 4px;">Together, we can make a difference.</p>
          <p style="color: #555; line-height: 1.8; margin: 0 0 16px;">Warm regards,</p>
          <p style="color: #01381d; font-weight: bold; margin: 0; font-size: 14px;">MAI Diaspora Network</p>
          <p style="color: #555; font-size: 13px; margin: 4px 0 0;">Hon. Mathew Aigbuhenze Iduoriyekemwen</p>
          <p style="color: #888; font-size: 12px; margin: 2px 0 0;">Diaspora Representative, Edo South Diaspora District</p>
          <p style="color: #f97316; font-size: 12px; font-weight: bold; margin: 8px 0 0; letter-spacing: 2px; text-transform: uppercase;">The Time Is MAI</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #01381d; padding: 20px 32px; text-align: center;">
        <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin: 0;">
          © 2027 MAI Edo South Campaign. All Rights Reserved.<br/>
          55, Second East Circular Road, Benin City, Edo State, Nigeria.
        </p>
      </div>

    </div>
  `
}

export function diasporaAdminEmail(data: {
  fullName: string
  email: string
  phone: string
  lga: string
  ward: string
  memberId: string
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #01381d; padding: 24px;">
        <h2 style="color: #ffffff; margin: 0;">New Volunteer Application</h2>
        <p style="color: #f97316; margin: 4px 0 0; font-size: 12px; letter-spacing: 2px;">MAI EDO SOUTH 2027</p>
      </div>

      <div style="padding: 24px; background: #ffffff;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase; width: 40%;">Member ID</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; font-weight: bold; color: #f97316;">${data.memberId}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">Name</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; font-weight: bold;">${data.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">Email</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${data.email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">Phone</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${data.phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">LGA</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${data.lga}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">Ward</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${data.ward}</td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #888; font-size: 12px; text-transform: uppercase;">Areas of Service</td>
            <td style="padding: 10px;"></td>
          </tr>
        </table>

        <div style="margin-top: 24px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/volunteers" 
             style="background: #01381d; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
            View in Dashboard
          </a>
        </div>
      </div>
    </div>
  `
}
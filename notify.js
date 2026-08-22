// notify.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, name, status, bookingId } = req.body;

  const message = status === 'Approved'
    ? `Hi ${name}, your IMUKA booking (#${bookingId}) has been APPROVED! Our team will reach out shortly.`
    : `Hi ${name}, your IMUKA booking (#${bookingId}) has been CANCELLED. Contact support for details.`;

  try {
    // Console log for execution verification on Vercel Dashboard logs
    console.log(`[SMS DISPATCH] Destination: ${phone} | Content: "${message}"`);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Notification route executed successfully.',
      details: { phone, status, bookingId }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

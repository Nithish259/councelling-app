exports.bookingEmail = ({ name, date, time, counsellor }) => `
  <h2>📅 Appointment Confirmed</h2>
  <p>Hi <b>${name}</b>,</p>
  <p>Your counseling session has been booked successfully.</p>

  <ul>
    <li><b>Counsellor:</b> ${counsellor}</li>
    <li><b>Date:</b> ${date}</li>
    <li><b>Time:</b> ${time}</li>
  </ul>

  <p>Take care 💙</p>
  <p>— Counseling Platform</p>
`;

exports.paymentEmail = ({ name, amount }) => `
  <h2>💳 Payment Successful</h2>
  <p>Hi ${name},</p>
  <p>Your payment of <b>₹${amount}</b> was successful.</p>
  <p>Your session is now confirmed.</p>
`;

exports.sessionCompletedEmail = ({ name }) => `
  <h2>✅ Session Completed</h2>
  <p>Hi ${name},</p>
  <p>Your counseling session has been completed.</p>
  <p>We hope it helped you.</p>
`;

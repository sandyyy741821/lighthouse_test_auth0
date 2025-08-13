import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' })); // Adjust as needed

const AUTH0_DOMAIN = "dev-eh3uj1z7jgk7qiuv.us.auth0.com";
const AUTH0_AUDIENCE = `https://${AUTH0_DOMAIN}/api/v2/`;

const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
  }),
  audience: AUTH0_AUDIENCE,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

app.post("/api/resend-verification", checkJwt, async (req, res) => {
  const { userId } = req.body;

  try {
    const tokenRes = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      audience: `https://${AUTH0_DOMAIN}/api/v2/`,
      grant_type: "client_credentials",
    });

    const mgmtToken = tokenRes.data.access_token;

    // Get current count
    const userRes = await axios.get(
      `https://${AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(userId)}`,
      {
        headers: { Authorization: `Bearer ${mgmtToken}` },
      }
    );

    const currentCount = userRes.data.user_metadata?.verify_mail_count || 0;

    // Increment and update metadata
    await axios.patch(
      `https://${AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(userId)}`,
      {
        user_metadata: {
          verify_mail_count: currentCount + 1,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${mgmtToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Send verification email
    await axios.post(
      `https://${AUTH0_DOMAIN}/api/v2/jobs/verification-email`,
      { user_id: userId },
      {
        headers: {
          Authorization: `Bearer ${mgmtToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ message: "Email sent, count updated." });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to resend verification email" });
  }
});


app.listen(3001, () => {
  console.log("✅ Backend running on http://localhost:3001");
});

const apiKeySid = 'SKeqlYkscDIgJ4YqAHWBdQILRcgJGxS53';
const apiKeySecret = 'UHFUYUs4RXVRSVVPcEZyVlVaUlZWTEduaGxZNDhSeWU=';
const userId = process.argv[0];

const token = getAccessToken();
console.log(token);

function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 3600;

  const header = { cty: 'stringee-api;v=1' };
  const payload = {
    jti: `${apiKeySid}-${now}`,
    iss: apiKeySid,
    exp,
    userId
  };

  const jwt = require('jsonwebtoken');
  const token = jwt.sign(payload, apiKeySecret, {
    algorithm: 'HS256',
    header
  });
  return token;
}

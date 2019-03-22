
const jwt = require('jsonwebtoken');
// Token 数据
const payload = {
  name: 'leitong',
  admin: true
}
// 密钥
const secret = 'ILOVEXLY';

// 签发 Token
const token = jwt.sign(payload, secret, { expiresIn: '1day' });

module.exports=token;
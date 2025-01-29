const jwt = require (jsonwebtoken);

const JWT_SECRET = process.env.JWT_SECRET || 'cc31a1e9116bdd49557349262b1acf5f2eda8bfc5030e2f6583f5aa4c2573d4d5f178c02b553b894f23cdb90443d3a7b2112a0d467a319ce243e0bf15750a7d30f1a29175a4964faa08c28fe86751f854012673bf672d4824c642b6ebbf2196f051a1493623520f0223ec49516057d297a0b9443165f4ba35911e56d17af96c4f3e0f550deb867ef4920afc6d98f7d11d45cee783caedc622b8d650d0fe46efc08808ac522e91348e25bedb8c6e6e6065a9d2cccdbb5f5187d4ffc06a26d5d3b9d743b5694b038412de58406c9dcae52fe9ba2fd28a3919faab4586deda24373c920f512a27c817fe7f26b1db0e511440587aaa6144c5ef3853a2102726216c5';

 export const generateToken = (user) => {
  const payload = { 
    id: user._id,
    role: user.role, 
    name: user.name,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  return token;
};

 export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET); 
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

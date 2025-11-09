import jwt from "jsonwebtoken";

export const createVerificationToken = (userId: string): string => {
  const token = jwt.sign(
    { 
      userId, 
      type: 'email_verification' 
    },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "24h" }
  );
  return token;
};

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as any;
    if (decoded.type !== 'email_verification') {
      return null;
    }
    return { userId: decoded.userId };
  } catch (error) {
    return null;
  }
};


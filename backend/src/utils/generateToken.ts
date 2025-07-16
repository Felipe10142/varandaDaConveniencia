import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { Types } from "mongoose";

export const generateToken = (id: string | Buffer) => {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  // 7 días en segundos
  const options: SignOptions = { expiresIn: 60 * 60 * 24 * 7 };
  return jwt.sign({ id }, secret, options);
};

export const verifyToken = (token: string): { id: string } => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    return decoded;
  } catch (error) {
    throw new Error("Token inválido ou expirado");
  }
};

// Generar token de refresh
export const generateRefreshToken = (userId: Types.ObjectId | string): string => {
  const id = typeof userId === "string" ? userId : userId.toString();
  const secret = Buffer.from(process.env.JWT_REFRESH_SECRET || "superrefreshsecretkey");
  const options: SignOptions = { expiresIn: "30d" };
  return jwt.sign({ id }, secret, options);
};

// Verificar token de refresh
export const verifyRefreshToken = (token: string): { id: string } => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
      id: string;
    };
    return decoded;
  } catch (error) {
    throw new Error("Token de refresh inválido ou expirado");
  }
};

// Generar token temporal (para reseteo de contraseña, verificación de email, etc.)
export const generateTempToken = (
  data: any,
  expiresIn: string = "1h",
): string => {
  return jwt.sign(data, process.env.JWT_SECRET!, {
    expiresIn,
  });
};

// Verificar token temporal
export const verifyTempToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch (error) {
    throw new Error("Token temporário inválido ou expirado");
  }
};

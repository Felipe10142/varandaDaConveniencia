import jwt from "jsonwebtoken";
export const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || "your-secret-key";
    const options = { expiresIn: 60 * 60 * 24 * 7 };
    return jwt.sign({ id }, secret, options);
};
export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
    catch (error) {
        throw new Error("Token inválido ou expirado");
    }
};
export const generateRefreshToken = (userId) => {
    const id = typeof userId === "string" ? userId : userId.toString();
    const secret = process.env.JWT_REFRESH_SECRET || "superrefreshsecretkey";
    const options = { expiresIn: "30d" };
    return jwt.sign({ id }, secret, options);
};
export const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        return decoded;
    }
    catch (error) {
        throw new Error("Token de refresh inválido ou expirado");
    }
};
export const generateTempToken = (data, expiresIn = "1h") => {
    const secret = process.env.JWT_SECRET || "your-secret-key";
    const options = { expiresIn: expiresIn };
    return jwt.sign(data, secret, options);
};
export const verifyTempToken = (token) => {
    try {
        const secret = process.env.JWT_SECRET || "your-secret-key";
        const decoded = jwt.verify(token, secret);
        return decoded;
    }
    catch (error) {
        throw new Error("Token temporário inválido ou expirado");
    }
};
//# sourceMappingURL=generateToken.js.map
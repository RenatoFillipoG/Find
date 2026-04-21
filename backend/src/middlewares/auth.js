import jwt from 'jsonwebtoken';

export const authMiddleware = (request, response, next) => {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return response.status(401).json({ message: "Você não está logado!" });
    }

    const parts = authHeader.split(' ');
    
    if (parts.length !== 2) {
        return response.status(401).json({ message: "Erro no formato do token!" });
    }

    const [scheme, token] = parts;

    const secret = "FDNisdbfiSBFIbibaibdisbdB8123129389g98g98G@(!@U#!@*8192g392g79g79g(&G#(!G(g92319g29g79G@#&";

    jwt.verify(token, secret, (error, decoded) => {
        if (error) {
            return response.status(401).json({ message: "Token inválido ou expirado!" });
        }

        request.userId = decoded.id;

        return next();
    });
};
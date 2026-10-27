const bcrypt = require("bcryptjs");

const BCRYPT_ROUNDS = 12;
const PASSWORD_MIN_LENGTH = 8;
// o bcrypt considera apenas os primeiros 72 bytes da senha
const PASSWORD_MAX_BYTES = 72;

// hash usado quando o e-mail não existe, para que o tempo de resposta
// do login não revele se o usuário está cadastrado
const DUMMY_HASH = bcrypt.hashSync("theome-dummy-password", BCRYPT_ROUNDS);

function validatePassword(password, passwordConfirm) {
    if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
        return "A senha deve ter pelo menos " + PASSWORD_MIN_LENGTH + " caracteres.";
    }
    if (Buffer.byteLength(password, "utf8") > PASSWORD_MAX_BYTES) {
        return "A senha deve ter no máximo " + PASSWORD_MAX_BYTES + " caracteres.";
    }
    if (password !== passwordConfirm) {
        return "A confirmação não confere com a senha informada.";
    }
    return null;
}

function hashPassword(password) {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
}

// compara sempre, mesmo sem hash, para manter o tempo de resposta constante
async function verifyPassword(password, passwordHash) {
    const matches = await bcrypt.compare(String(password || ""), passwordHash || DUMMY_HASH);
    return Boolean(passwordHash) && matches;
}

module.exports = {
    PASSWORD_MIN_LENGTH,
    PASSWORD_MAX_BYTES,
    validatePassword,
    hashPassword,
    verifyPassword,
};

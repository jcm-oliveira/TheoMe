const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// fotos ficam fora da pasta public: só são exibidas para quem está logado (rota /cms-UserAvatar)
const AVATAR_DIR = path.join(__dirname, "..", "..", "storage", "avatars");
const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
const AVATAR_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
};

fs.mkdirSync(AVATAR_DIR, { recursive: true });

const upload = multer({
    storage: multer.diskStorage({
        destination: AVATAR_DIR,
        // nome aleatório: não usa o nome enviado pelo navegador
        filename: (req, file, cb) => cb(null, crypto.randomBytes(16).toString("hex") + AVATAR_TYPES[file.mimetype]),
    }),
    limits: { fileSize: AVATAR_MAX_BYTES, files: 1 },
    fileFilter: (req, file, cb) => {
        if (AVATAR_TYPES[file.mimetype]) {
            return cb(null, true);
        }
        const error = new Error("tipo de arquivo não permitido");
        error.code = "INVALID_TYPE";
        return cb(error);
    },
}).single("userAvatar");

const INVALID_TYPE_MESSAGE = "A foto deve ser uma imagem JPG, PNG ou WEBP.";

// confere a assinatura do arquivo, já que o tipo informado pelo navegador pode ser falso
function hasImageSignature(filePath) {
    const header = Buffer.alloc(12);
    const fd = fs.openSync(filePath, "r");
    try {
        fs.readSync(fd, header, 0, 12, 0);
    } finally {
        fs.closeSync(fd);
    }
    const isJpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
    const isPng = header.toString("hex", 0, 8) === "89504e470d0a1a0a";
    const isWebp = header.toString("ascii", 0, 4) === "RIFF" && header.toString("ascii", 8, 12) === "WEBP";
    return isJpeg || isPng || isWebp;
}

function removeAvatarFile(fileName) {
    if (!fileName || path.basename(fileName) !== fileName) {
        return;
    }
    fs.unlink(path.join(AVATAR_DIR, fileName), () => {});
}

// Recebe a foto (campo "userAvatar") sem interromper o formulário:
// em caso de problema, req.avatarError traz a mensagem para a tela.
function avatarUpload(req, res, next) {
    upload(req, res, (err) => {
        if (err) {
            req.avatarError = err.code === "LIMIT_FILE_SIZE"
                ? "A foto deve ter no máximo 2 MB."
                : err.code === "INVALID_TYPE"
                    ? INVALID_TYPE_MESSAGE
                    : "Não foi possível receber a foto.";
            return next();
        }
        if (req.file && !hasImageSignature(req.file.path)) {
            removeAvatarFile(req.file.filename);
            req.file = undefined;
            req.avatarError = INVALID_TYPE_MESSAGE;
        }
        return next();
    });
}

// descarta a foto recebida quando o formulário não foi salvo
function discardUploadedAvatar(req) {
    if (req.file) {
        removeAvatarFile(req.file.filename);
        req.file = undefined;
    }
}

function sendAvatar(res, fileName) {
    if (!fileName || path.basename(fileName) !== fileName) {
        return res.sendStatus(404);
    }
    res.set("X-Content-Type-Options", "nosniff");
    res.set("Cache-Control", "private, max-age=300");
    return res.sendFile(path.join(AVATAR_DIR, fileName), (err) => {
        if (err && !res.headersSent) {
            res.sendStatus(404);
        }
    });
}

// endereço da foto; o nome do arquivo muda a cada envio e serve para renovar o cache do navegador
function avatarUrl(userId, fileName) {
    return fileName ? "/cms-UserAvatar/" + userId + "?v=" + encodeURIComponent(fileName) : null;
}

module.exports = {
    avatarUpload,
    avatarUrl,
    discardUploadedAvatar,
    removeAvatarFile,
    sendAvatar,
};

const User = require("../model/UserModel");
const { readProfileForm, validateProfileForm, loadProfileOptions, profileFromRow } = require("../helpers/userProfile");
const { discardUploadedAvatar, removeAvatarFile, sendAvatar, avatarUrl } = require("../helpers/avatarUpload");

// Pop-up "Meus dados": o usuário logado edita os próprios dados pessoais.
// E-mail, status e permissões só mudam pelo cadastro de usuários.
// O pop-up é aberto e salvo por public/scripts/cms-MyProfile.js, sem recarregar a tela.

module.exports = {
    // conteúdo do pop-up
    async loadProfilePage(req, res) {
        const [userSelect] = await User.selectUserById(req.currentUser.id);
        const userRow = userSelect[0];

        return res.render("../views/cms/cms-MyProfile-I", {
            ...(await loadProfileOptions(User)),
            userEmail: userRow.email,
            user: { userName: userRow.name, ...profileFromRow(userRow) },
        });
    },

    // responde em JSON: { ok, message, name, avatarUrl }
    async updateProfilePage(req, res) {
        const userId = req.currentUser.id;
        const [userSelect] = await User.selectUserById(userId);
        const currentRow = userSelect[0];

        const profile = {
            userName: (req.body.userName || "").trim(),
            ...readProfileForm(req.body),
        };

        const validationError = !profile.userName || profile.userName.length > 150
            ? "Informe o nome completo (até 150 caracteres)."
            : req.avatarError || (await validateProfileForm(profile, User));

        if (validationError) {
            discardUploadedAvatar(req);
            return res.status(400).json({ ok: false, message: validationError });
        }

        profile.avatar = req.file ? req.file.filename : profile.removeAvatar ? null : undefined;
        const update = await User.updateOwnProfile(userId, profile);

        if (update.alertTypeResult === "alert-danger") {
            discardUploadedAvatar(req);
            return res.status(500).json({ ok: false, message: update.textResult });
        }

        // foto substituída ou removida: apaga o arquivo antigo
        if (profile.avatar !== undefined && currentRow.avatar) {
            removeAvatarFile(currentRow.avatar);
        }

        const savedAvatar = profile.avatar === undefined ? currentRow.avatar : profile.avatar;
        return res.json({
            ok: true,
            message: update.textResult,
            name: profile.userName,
            avatarUrl: avatarUrl(userId, savedAvatar),
        });
    },

    // foto do usuário: só para quem está logado (a pasta não é pública)
    async sendUserAvatar(req, res) {
        const [userSelect] = await User.selectUserById(Number(req.params.id));
        const userRow = userSelect[0];
        return sendAvatar(res, userRow ? userRow.avatar : null);
    },
};

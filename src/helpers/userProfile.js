// Dados pessoais do usuário: usados no cadastro de usuários e na tela "Meus dados".

const FIRST_BIRTH_YEAR = 1900;

function optionalInteger(value) {
    const number = Number(value);
    return value === undefined || value === "" || !Number.isInteger(number) || number <= 0 ? null : number;
}

function readProfileForm(body) {
    return {
        userContact: (body.userContact || "").trim() || null,
        userBirthYear: optionalInteger(body.userBirthYear),
        idCity: optionalInteger(body.userCity),
        // consentimento só vale quando a caixa é marcada
        newsletterOptIn: body.userNewsletter === "1" ? 1 : 0,
        removeAvatar: body.userRemoveAvatar === "1",
    };
}

async function validateProfileForm(profile, User) {
    if (profile.userContact) {
        // WhatsApp: números com DDI/DDD opcionais, aceitando espaços, +, ( ) e -
        const digits = profile.userContact.replace(/\D/g, "");
        if (!/^[0-9+()\s-]+$/.test(profile.userContact) || profile.userContact.length > 20 || digits.length < 10 || digits.length > 15) {
            return "Informe um número de WhatsApp válido, com DDD (ex.: +55 11 99999-9999).";
        }
    }
    const currentYear = new Date().getFullYear();
    if (profile.userBirthYear !== null && (profile.userBirthYear < FIRST_BIRTH_YEAR || profile.userBirthYear > currentYear)) {
        return "Informe um ano de nascimento entre " + FIRST_BIRTH_YEAR + " e " + currentYear + ".";
    }
    if (profile.idCity !== null && !(await User.cityExists(profile.idCity))) {
        return "Selecione um local de origem da lista.";
    }
    return null;
}

function birthYearOptions() {
    const years = [];
    for (let year = new Date().getFullYear(); year >= FIRST_BIRTH_YEAR; year--) {
        years.push(year);
    }
    return years;
}

// opções usadas pelo bloco de campos cms-User-ProfileFields.ejs
async function loadProfileOptions(User) {
    const [cityOptions] = await User.selectCityOptions();
    return {
        cityOptions,
        birthYearOptions: birthYearOptions(),
    };
}

// converte o registro do banco para os nomes usados nos formulários
function profileFromRow(row) {
    return {
        userContact: row.contact,
        userBirthYear: row.birthYear,
        idCity: row.idCity,
        newsletterOptIn: row.newsletterOptIn,
        avatar: row.avatar,
    };
}

module.exports = {
    readProfileForm,
    validateProfileForm,
    loadProfileOptions,
    profileFromRow,
};

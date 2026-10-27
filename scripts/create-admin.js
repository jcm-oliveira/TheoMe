//CREATE FIRST ADMINISTRATOR
//Cria um usuário com todas as permissões cadastradas. Uso: npm run create-admin
//A senha é digitada sem aparecer na tela e nunca é passada pela linha de comando.

const readline = require("readline");
const User = require("../src/model/UserModel");
const Permission = require("../src/model/PermissionModel");
const { validatePassword, hashPassword } = require("../src/auth/password");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ask(question, { hidden = false } = {}) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
        let muted = false;
        // esconde o que é digitado na senha
        rl._writeToOutput = (text) => {
            if (!muted) {
                process.stdout.write(text);
            } else if (text.includes("\n") || text.includes("\r")) {
                process.stdout.write("\n");
            }
        };
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
        muted = hidden;
    });
}

(async () => {
    const name = (await ask("Nome completo: ")).trim();
    const email = (await ask("E-mail (login): ")).trim().toLowerCase();
    const password = await ask("Senha (mínimo 8 caracteres): ", { hidden: true });
    const passwordConfirm = await ask("Confirmar senha: ", { hidden: true });

    const error = !name || name.length > 150
        ? "Informe o nome completo (até 150 caracteres)."
        : !EMAIL_PATTERN.test(email) || email.length > 254
            ? "Informe um e-mail válido."
            : validatePassword(password, passwordConfirm)
                || (await User.emailInUse(email) ? "Já existe um usuário com este e-mail." : null);

    if (error) {
        console.log("Usuário não criado: " + error);
        process.exit(1);
    }

    const [permissions] = await Permission.selectPermissionOptions();
    const result = await User.insertUsers({
        userName: name,
        userEmail: email,
        userStatus: 1,
        passwordHash: await hashPassword(password),
        permissionIds: permissions.map((permission) => permission.id),
    });

    console.log(result.textResult);
    console.log("Permissões vinculadas: " + (permissions.map((permission) => permission.code).join(", ") || "nenhuma (rode sql/permission.sql)"));
    process.exit(result.alertTypeResult === "alert-success" ? 0 : 1);
})().catch((err) => {
    console.log("Usuário não criado:", err.code || err.message);
    process.exit(1);
});

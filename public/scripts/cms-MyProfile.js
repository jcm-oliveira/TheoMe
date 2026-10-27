// Pop-up "Meus dados" (menu do usuário do CMS).
// Carrega o formulário ao abrir, salva sem recarregar a página e fecha ao concluir,
// mantendo a tela que estava aberta por baixo.
(function () {
    const modal = document.getElementById("MyProfileModal");
    if (!modal || !window.jQuery) {
        return;
    }

    const dialog = modal.querySelector("[data-my-profile-dialog]");
    const LOGIN_URL = "/cms-LoginPage";

    // sessão expirada: o servidor redireciona para o login
    function isLoginRedirect(response) {
        return response.redirected && new URL(response.url).pathname.toLowerCase() === LOGIN_URL.toLowerCase();
    }

    function showMessage(text) {
        const message = dialog.querySelector("[data-my-profile-message]");
        if (message) {
            message.textContent = text;
            message.classList.remove("d-none");
            message.scrollIntoView({ block: "nearest" });
        }
    }

    function updateUserMenu(name, avatarUrl) {
        document.querySelectorAll("[data-current-user-name]").forEach((element) => {
            element.textContent = name;
        });
        document.querySelectorAll("[data-current-user-avatar]").forEach((image) => {
            if (avatarUrl) {
                image.src = avatarUrl;
                image.classList.remove("d-none");
            } else {
                image.removeAttribute("src");
                image.classList.add("d-none");
            }
        });
    }

    async function loadForm() {
        dialog.innerHTML = '<div class="modal-content"><div class="modal-body">Carregando...</div></div>';
        try {
            const response = await fetch("/cms-MyProfile", { credentials: "same-origin" });
            if (isLoginRedirect(response)) {
                window.location.href = LOGIN_URL;
                return;
            }
            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }
            dialog.innerHTML = await response.text();
        } catch (error) {
            dialog.innerHTML = '<div class="modal-content"><div class="modal-body">'
                + '<div class="alert alert-danger">Não foi possível carregar os seus dados. Tente novamente.</div>'
                + '</div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button></div></div>';
        }
    }

    async function saveForm(form) {
        const saveButton = dialog.querySelector('button[type="submit"]');
        if (saveButton) {
            saveButton.disabled = true;
        }
        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                credentials: "same-origin",
                headers: { Accept: "application/json" },
            });
            if (isLoginRedirect(response)) {
                window.location.href = LOGIN_URL;
                return;
            }
            const result = await response.json();
            if (!result.ok) {
                showMessage(result.message);
                return;
            }
            updateUserMenu(result.name, result.avatarUrl);
            window.jQuery(modal).modal("hide");
        } catch (error) {
            showMessage("Não foi possível salvar os seus dados. Tente novamente.");
        } finally {
            if (saveButton) {
                saveButton.disabled = false;
            }
        }
    }

    // recarrega a cada abertura, para mostrar sempre os dados gravados
    window.jQuery(modal).on("show.bs.modal", loadForm);

    dialog.addEventListener("submit", (event) => {
        if (event.target.id === "form-my-profile") {
            event.preventDefault();
            saveForm(event.target);
        }
    });
})();

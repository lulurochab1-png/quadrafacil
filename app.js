/**
 * QuadraFácil - Sistema de Agendamento de Quadras
 * Arquivo de Lógica do Frontend (JavaScript)
 * 
 * Este arquivo gerencia:
 * 1. O banco de dados fictício (armazenado no localStorage para persistência).
 * 2. A navegação entre as telas (SPA - Single Page Application).
 * 3. A filtragem de quadras.
 * 4. A reserva de quadras em tempo real com atualização de resumo.
 * 5. O painel de administração (aprovar, cancelar, bloquear).
 * 6. O login simulado.
 * 
 * Sinta-se à vontade para modificar as quadras padrão ou as regras de negócio!
 */

// 1. BANCO DE DADOS INICIAL (MOCK DATA)
// Você pode alterar, adicionar ou remover quadras aqui.
const QUADRAS_PADRAO = [
    {
        id: "quadra-1",
        nome: "Quadra 1",
        modalidade: "Futsal",
        local: "Quadra Coberta",
        status: "Disponível", // "Disponível" ou "Ocupada"
        imagem: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "quadra-2",
        nome: "Quadra 2",
        modalidade: "Vôlei",
        local: "Quadra Externa",
        status: "Disponível",
        imagem: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "quadra-3",
        nome: "Quadra 3",
        modalidade: "Basquete",
        local: "Quadra Coberta",
        status: "Ocupada",
        imagem: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "quadra-4",
        nome: "Quadra 4",
        modalidade: "Futebol Society",
        local: "Quadra Externa",
        status: "Disponível",
        imagem: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "quadra-5",
        nome: "Quadra 5",
        modalidade: "Beach Tennis",
        local: "Quadra de Areia",
        status: "Disponível",
        imagem: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "quadra-6",
        nome: "Quadra 6",
        modalidade: "Poliesportiva",
        local: "Quadra Externa",
        status: "Disponível",
        imagem: "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?auto=format&fit=crop&q=80&w=800"
    }
];

// Reservas padrão correspondentes aos wireframes (com e-mail para simular painel de clientes)
const RESERVAS_PADRAO = [
    {
        id: "reserva-1",
        quadraId: "quadra-1",
        quadraNome: "Quadra 1 - Futsal",
        data: "2025-05-24", // Formato ISO AAAA-MM-DD
        horario: "19:00 - 20:00",
        nomeUsuario: "Thiago Willames",
        email: "thiagowillames99@gmail.com",
        telefone: "(93) 991087098",
        status: "Confirmada" // "Confirmada", "Pendente", "Bloqueada"
    },
    {
        id: "reserva-2",
        quadraId: "quadra-2",
        quadraNome: "Quadra 2 - Vôlei",
        data: "2025-05-25",
        horario: "10:00 - 11:00",
        nomeUsuario: "Ruan Samuel",
        email: "ruan@email.com",
        telefone: "(81) 98888-8888",
        status: "Confirmada"
    },
    {
        id: "reserva-3",
        quadraId: "quadra-4",
        quadraNome: "Quadra 4 - Society",
        data: "2025-05-26",
        horario: "18:00 - 19:00",
        nomeUsuario: "João Santos",
        email: "joao@email.com",
        telefone: "(81) 96666-6666",
        status: "Pendente"
    },
    {
        id: "reserva-4",
        quadraId: "quadra-3",
        quadraNome: "Quadra 3 - Basquete",
        data: "2025-05-27",
        horario: "20:00 - 21:00",
        nomeUsuario: "Carlos Silva",
        email: "carlos@email.com",
        telefone: "(81) 97777-7777",
        status: "Confirmada"
    },
    // Reservas adicionais de "hoje" (24/05/2025) para bater com a tela 5 (Admin)
    {
        id: "reserva-5",
        quadraId: "quadra-2",
        quadraNome: "Quadra 2 - Vôlei",
        data: "2025-05-24",
        horario: "08:00 - 09:00",
        nomeUsuario: "Ruan Samuel",
        email: "ruan@email.com",
        telefone: "(81) 98888-8888",
        status: "Confirmada"
    },
    {
        id: "reserva-6",
        quadraId: "quadra-1",
        quadraNome: "Quadra 1 - Futsal",
        data: "2025-05-24",
        horario: "09:00 - 10:00",
        nomeUsuario: "Thiago Willames",
        email: "thiagowillames99@gmail.com",
        telefone: "(93) 991087098",
        status: "Confirmada"
    },
    {
        id: "reserva-7",
        quadraId: "quadra-3",
        quadraNome: "Quadra 3 - Basquete",
        data: "2025-05-24",
        horario: "19:00 - 20:00",
        nomeUsuario: "Carlos Silva",
        email: "carlos@email.com",
        telefone: "(81) 97777-7777",
        status: "Pendente"
    },
    {
        id: "reserva-8",
        quadraId: "quadra-4",
        quadraNome: "Quadra 4 - Society",
        data: "2025-05-24",
        horario: "20:00 - 21:00",
        nomeUsuario: "João Santos",
        email: "joao@email.com",
        telefone: "(81) 96666-6666",
        status: "Confirmada"
    }
];

// 2. INICIALIZAÇÃO DO ESTADO
class AppState {
    constructor() {
        this.initDatabase();
        this.activeView = "home";
        this.previousView = "home";
        this.isLoggedIn = false;
        this.userRole = null;            // 'admin' ou 'client'
        this.emailLogado = null;         // E-mail do usuário ativo
        this.redirectAfterLogin = null;  // Para redirecionamento pós-login
    }

    initDatabase() {
        if (!localStorage.getItem("quadras")) {
            localStorage.setItem("quadras", JSON.stringify(QUADRAS_PADRAO));
        }
        if (!localStorage.getItem("reservas")) {
            localStorage.setItem("reservas", JSON.stringify(RESERVAS_PADRAO));
        }
    }

    getQuadras() {
        return JSON.parse(localStorage.getItem("quadras"));
    }

    getReservas() {
        return JSON.parse(localStorage.getItem("reservas"));
    }

    saveQuadras(quadras) {
        localStorage.setItem("quadras", JSON.stringify(quadras));
    }

    saveReservas(reservas) {
        localStorage.setItem("reservas", JSON.stringify(reservas));
    }
}

const state = new AppState();

// 3. SELETORES DO DOM
const sections = {
    home: document.getElementById("section-home"),
    quadras: document.getElementById("section-quadras"),
    agendamento: document.getElementById("section-agendamento"),
    reservas: document.getElementById("section-reservas"),
    admin: document.getElementById("section-admin"),
    login: document.getElementById("section-login")
};

const navItems = document.querySelectorAll(".nav-item");
const appHeader = document.getElementById("app-header");
const appFooter = document.getElementById("app-footer");
const headerCta = document.getElementById("header-cta-btn");
const logoutContainer = document.getElementById("logout-btn-container");

// Modals
const modalOverlay = document.getElementById("modal-overlay");
const modalIcon = document.getElementById("modal-icon");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const modalConfirmBtn = document.getElementById("modal-confirm-btn");
const modalCancelBtn = document.getElementById("modal-cancel-btn");

// 4. FUNÇÕES DE NAVEGAÇÃO
function switchView(viewName) {
    // Roteamento condicional para controle de acesso (Login obrigatório para Reservas e Admin)
    if (viewName === "reservas" && !state.isLoggedIn) {
        state.redirectAfterLogin = "reservas";
        switchView("login");
        showModal("warning", "Acesso Restrito", "Por favor, faça login com sua conta para visualizar, pagar e gerenciar suas reservas.");
        return;
    }

    if (viewName === "admin") {
        if (!state.isLoggedIn) {
            state.redirectAfterLogin = "admin";
            switchView("login");
            return;
        } else if (state.userRole !== "admin") {
            showModal("warning", "Acesso Negado", "Seu usuário não possui permissões administrativas. Redirecionando para suas reservas.");
            switchView("reservas");
            return;
        }
    }

    // Guardar a tela anterior (para o botão voltar do Login)
    if (viewName !== "login") {
        state.previousView = viewName;
    }

    state.activeView = viewName;

    // Controlar visibilidade do cabeçalho e rodapé
    if (viewName === "login") {
        appHeader.style.display = "none";
        appFooter.style.display = "none";
    } else {
        appHeader.style.display = "flex";
        appFooter.style.display = "block";
    }

    // Controlar botão CTA no cabeçalho
    if (viewName === "admin" || viewName === "login") {
        headerCta.style.display = "none";
    } else {
        headerCta.style.display = "flex";
    }

    // Controlar botão Sair (visível no cabeçalho se estiver logado)
    if (state.isLoggedIn) {
        logoutContainer.style.display = "flex";
        // Personaliza o texto do botão de Logout dependendo de quem está logado
        logoutContainer.querySelector("span").textContent = `Sair (${state.emailLogado.split('@')[0]})`;
    } else {
        logoutContainer.style.display = "none";
    }

    // Atualizar classe active nos links de navegação
    navItems.forEach(item => {
        if (item.getAttribute("data-view") === viewName) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    // Mostrar a seção correspondente e ocultar as demais
    Object.keys(sections).forEach(key => {
        if (key === viewName) {
            sections[key].classList.add("active");
        } else {
            sections[key].classList.remove("active");
        }
    });

    // Disparar renderizadores de tela específicos
    if (viewName === "quadras") {
        renderCourts();
    } else if (viewName === "agendamento") {
        setupBookingForm();
    } else if (viewName === "reservas") {
        renderUserReservations();
    } else if (viewName === "admin") {
        renderAdminDashboard();
    }

    // Rolar para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Configurar ouvintes nos itens de navegação
navItems.forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        const targetView = item.getAttribute("data-view");
        
        if (targetView === "admin" && !state.isLoggedIn) {
            switchView("login");
        } else {
            switchView(targetView);
        }
    });
});

// Botão Sair no cabeçalho (desloga e redireciona para a home)
logoutContainer.addEventListener("click", () => {
    state.isLoggedIn = false;
    state.userRole = null;
    state.emailLogado = null;
    showModal("success", "Sessão Finalizada", "Você saiu da sua conta com sucesso.");
    switchView("home");
});

// Botões "Agendar agora"
document.querySelectorAll(".trigger-booking").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        switchView("agendamento");
    });
});

// 5. MÉTODOS DE RENDERIZAÇÃO E LOGICA DE TELAS

// --- TELA DE LOGIN ---
const loginForm = document.getElementById("login-form");
const passwordInput = document.getElementById("login-senha");
const passwordToggle = document.getElementById("password-toggle");

// Mostrar/ocultar senha
passwordToggle.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
        `;
    } else {
        passwordInput.type = "password";
        passwordToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
        `;
    }
});

// Processar formulário de login (Suporta Admin e Cliente)
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const emailVal = document.getElementById("login-email").value.trim().toLowerCase();
    const senhaVal = passwordInput.value;

    if (!emailVal || !senhaVal) return;

    state.isLoggedIn = true;
    state.emailLogado = emailVal;

    // Define role baseada no e-mail digitado
    if (emailVal === "admin@quadrafacil.com.br") {
        state.userRole = "admin";
        showModal("success", "Login Administrador", "Bem-vindo ao Painel de Administração da QuadraFácil!", () => {
            const nextView = state.redirectAfterLogin || "admin";
            state.redirectAfterLogin = null;
            switchView(nextView);
        });
    } else {
        state.userRole = "client";
        showModal("success", "Login Cliente", `Bem-vindo de volta! Carregando as reservas de ${emailVal}...`, () => {
            const nextView = state.redirectAfterLogin || "reservas";
            state.redirectAfterLogin = null;
            switchView(nextView);
        });
    }

    // Limpar formulário de login
    document.getElementById("login-email").value = "";
    passwordInput.value = "";
});

// Botão voltar da tela de Login
window.voltarTelaLogin = function() {
    state.redirectAfterLogin = null;
    switchView(state.previousView || "home");
};


// --- TELA DE QUADRAS (FILTRAGEM E VISUALIZAÇÃO) ---
const filterForm = document.getElementById("filter-form");

filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    renderCourts();
});

function renderCourts() {
    const courtsContainer = document.getElementById("courts-grid-container");
    const modalidadeFiltro = document.getElementById("filter-modalidade").value;
    const localFiltro = document.getElementById("filter-local").value;
    // (O filtro de data pode ser usado para verificar se a quadra está livre ou ocupada naquele dia)
    const dataFiltro = document.getElementById("filter-data").value;

    const quadras = state.getQuadras();
    const reservas = state.getReservas();

    let html = "";
    
    // Filtrar quadras
    const quadrasFiltradas = quadras.filter(q => {
        const matchesModalidade = modalidadeFiltro === "Todas" || q.modalidade.toLowerCase() === modalidadeFiltro.toLowerCase();
        const matchesLocal = localFiltro === "Todas" || q.local.toLowerCase() === localFiltro.toLowerCase();
        return matchesModalidade && matchesLocal;
    });

    if (quadrasFiltradas.length === 0) {
        courtsContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px 0; color: var(--text-muted);">
                Nenhuma quadra encontrada com os filtros aplicados.
            </div>
        `;
        return;
    }

    quadrasFiltradas.forEach(q => {
        // Determinar status com base na data do filtro
        let statusParaData = q.status;
        if (dataFiltro) {
            // Se houver uma reserva nessa data para essa quadra, marcamos como ocupada
            const temReserva = reservas.some(r => r.quadraId === q.id && r.data === dataFiltro && r.status !== 'Cancelada');
            if (temReserva) {
                statusParaData = "Ocupada";
            } else {
                statusParaData = "Disponível";
            }
        }

        const isDisponivel = statusParaData === "Disponível";
        const badgeClass = isDisponivel ? "status-disponivel" : "status-ocupada";
        const btnClass = isDisponivel ? "" : "disabled";
        const btnText = isDisponivel ? "Reservar" : "Ocupada";
        const clickAttr = isDisponivel ? `onclick="irParaAgendamento('${q.id}')"` : "";

        html += `
            <article class="court-card">
                <div class="court-card-img-wrapper">
                    <img class="court-card-img" src="${q.imagem}" alt="${q.nome}">
                </div>
                <div class="court-card-body">
                    <h3 class="court-card-title">${q.nome}</h3>
                    
                    <div class="court-card-info-item">
                        <!-- Icone de Raquete/Bola -->
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M6 12A6 6 0 0 1 18 12"></path>
                        </svg>
                        <span>${q.modalidade}</span>
                    </div>
                    
                    <div class="court-card-info-item">
                        <!-- Icone de Localização/Marcação -->
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>${q.local}</span>
                    </div>

                    <div class="court-status-badge ${badgeClass}">
                        <span class="status-dot"></span>
                        ${statusParaData}
                    </div>

                    <button class="court-book-btn ${btnClass}" ${clickAttr}>
                        ${btnText}
                    </button>
                </div>
            </article>
        `;
    });

    courtsContainer.innerHTML = html;
}

// Redirecionamento da quadra escolhida para o agendamento
window.irParaAgendamento = function(quadraId) {
    switchView("agendamento");
    const selectQuadra = document.getElementById("booking-quadra");
    if (selectQuadra) {
        selectQuadra.value = quadraId;
        selectQuadra.dispatchEvent(new Event("change"));
    }
};


// --- TELA DE AGENDAMENTO (FORMULÁRIO E RESUMO DINÂMICO) ---
const bookingForm = document.getElementById("booking-form");
const bookingQuadraSelect = document.getElementById("booking-quadra");
const bookingDataInput = document.getElementById("booking-data");
const bookingHorarioSelect = document.getElementById("booking-horario");
const bookingNomeInput = document.getElementById("booking-nome");
const bookingTelefoneInput = document.getElementById("booking-telefone");

// Resumos no card do lado direito
const summaryImg = document.getElementById("summary-img");
const summaryQuadra = document.getElementById("summary-quadra");
const summaryData = document.getElementById("summary-data");
const summaryHorario = document.getElementById("summary-horario");
const summaryNome = document.getElementById("summary-nome");
const summaryTelefone = document.getElementById("summary-telefone");
const summaryAlert = document.getElementById("summary-status-alert");

function setupBookingForm() {
    const quadras = state.getQuadras();
    
    // Popular o select de quadras
    bookingQuadraSelect.innerHTML = quadras
        .map(q => `<option value="${q.id}">${q.nome} - ${q.modalidade}</option>`)
        .join("");

    // Configurar data inicial como "hoje" ou "24/05/2025" (combinando com as telas)
    if (!bookingDataInput.value) {
        bookingDataInput.value = "2025-05-24";
    }

    // Definir ouvintes para atualizar o resumo da reserva em tempo real
    [bookingQuadraSelect, bookingDataInput, bookingHorarioSelect, bookingNomeInput, bookingTelefoneInput].forEach(elem => {
        elem.addEventListener("input", updateBookingSummary);
        elem.addEventListener("change", updateBookingSummary);
    });

    // Executar atualização de resumo inicial
    updateBookingSummary();
}

function updateBookingSummary() {
    const quadras = state.getQuadras();
    const reservas = state.getReservas();
    
    const quadraId = bookingQuadraSelect.value;
    const dataVal = bookingDataInput.value;
    const horarioVal = bookingHorarioSelect.value;
    const nomeVal = bookingNomeInput.value || "Thiago Willames"; // Fallback para ficar bonito no resumo
    const telefoneVal = bookingTelefoneInput.value || "(93) 991087098";

    const quadraSelecionada = quadras.find(q => q.id === quadraId);

    if (quadraSelecionada) {
        summaryImg.src = quadraSelecionada.imagem;
        summaryQuadra.textContent = `${quadraSelecionada.nome} - ${quadraSelecionada.modalidade}`;
    }

    // Formatar data para exibição PT-BR
    if (dataVal) {
        const partes = dataVal.split("-");
        if (partes.length === 3) {
            summaryData.textContent = `${partes[2]}/${partes[1]}/${partes[0]}`;
        } else {
            summaryData.textContent = dataVal;
        }
    } else {
        summaryData.textContent = "-";
    }

    summaryHorario.textContent = horarioVal;
    summaryNome.textContent = nomeVal;
    summaryTelefone.textContent = telefoneVal;

    // Verificar disponibilidade em tempo real
    const conflito = reservas.some(r => r.quadraId === quadraId && r.data === dataVal && r.horario === horarioVal && r.status !== 'Cancelada');
    
    if (conflito) {
        summaryAlert.className = "summary-status-alert not-available";
        summaryAlert.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Horário indisponível para reserva</span>
        `;
        document.getElementById("confirm-booking-btn").disabled = true;
        document.getElementById("confirm-booking-btn").style.opacity = "0.6";
        document.getElementById("confirm-booking-btn").style.cursor = "not-allowed";
    } else {
        summaryAlert.className = "summary-status-alert";
        summaryAlert.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Horário disponível para reserva</span>
        `;
        document.getElementById("confirm-booking-btn").disabled = false;
        document.getElementById("confirm-booking-btn").style.opacity = "1";
        document.getElementById("confirm-booking-btn").style.cursor = "pointer";
    }
}

// Submeter o agendamento
bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const quadras = state.getQuadras();
    const reservas = state.getReservas();
    
    const quadraId = bookingQuadraSelect.value;
    const dataVal = bookingDataInput.value;
    const horarioVal = bookingHorarioSelect.value;
    const nomeVal = bookingNomeInput.value;
    const telefoneVal = bookingTelefoneInput.value;

    if (!dataVal || !nomeVal || !telefoneVal) {
        showModal("warning", "Atenção", "Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const quadraSelecionada = quadras.find(q => q.id === quadraId);

    // Nova reserva
    const novaReserva = {
        id: "reserva-" + Date.now(),
        quadraId: quadraId,
        quadraNome: `${quadraSelecionada.nome} - ${quadraSelecionada.modalidade}`,
        data: dataVal,
        horario: horarioVal,
        nomeUsuario: nomeVal,
        email: state.emailLogado || "thiagowillames99@gmail.com", // Associa ao e-mail ativo ou cria fallback padrão
        telefone: telefoneVal,
        status: "Pendente" // Começa como Pendente para o Admin aprovar!
    };

    reservas.push(novaReserva);
    state.saveReservas(reservas);

    showModal("success", "Agendamento Realizado", "Sua solicitação de reserva foi enviada com sucesso e está aguardando confirmação no painel administrador.", () => {
        // Limpar formulário
        bookingNomeInput.value = "";
        bookingTelefoneInput.value = "";
        switchView("reservas");
    });
});


// --- TELA DE MINHAS RESERVAS (USUÁRIO) ---
function renderUserReservations() {
    const tableBody = document.getElementById("reservations-table-body");
    const reservas = state.getReservas();
    const emailLogado = state.emailLogado;

    // Filtra reservas pelo e-mail do cliente logado
    const reservasUsuario = reservas.filter(r => r.email === emailLogado);
    
    // Ordenar pela data
    const reservasOrdenadas = [...reservasUsuario].sort((a, b) => new Date(a.data) - new Date(b.data));

    if (reservasOrdenadas.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 30px; color: var(--text-muted);">
                    Nenhuma reserva cadastrada para o e-mail: <strong>${emailLogado}</strong>.
                </td>
            </tr>
        `;
        return;
    }

    let html = "";
    reservasOrdenadas.forEach(r => {
        // Formatar data
        let dataFormatada = r.data;
        const partes = r.data.split("-");
        if (partes.length === 3) {
            dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
        }

        // Estilo do status badge
        let statusStyle = "";
        if (r.status === "Confirmada") {
            statusStyle = "background-color: var(--bg-success); color: var(--text-success);";
        } else if (r.status === "Pendente") {
            statusStyle = "background-color: var(--bg-pending); color: var(--text-pending);";
        } else if (r.status === "Cancelada" || r.status === "Rejeitada") {
            statusStyle = "background-color: var(--bg-danger); color: var(--text-danger);";
        } else {
            statusStyle = "background-color: var(--bg-inactive); color: var(--text-inactive);";
        }

        const isCancelavel = r.status !== "Cancelada" && r.status !== "Rejeitada" && r.status !== "Bloqueada";
        
        let acoesHtml = "";
        if (isCancelavel) {
            // Ações: Cancelar e, se estiver Pendente, botão Pagar!
            acoesHtml = `<button class="table-action-btn" onclick="cancelarReservaUsuario('${r.id}')" style="margin-right: 4px;">Cancelar</button>`;
            if (r.status === "Pendente") {
                acoesHtml += `<button class="table-action-btn" style="background-color: var(--primary-green); color: white; border-color: var(--primary-green); font-weight: 600;" onclick="fazerPagamento('${r.id}')">Pagar</button>`;
            }
        } else {
            acoesHtml = `<span style="color: var(--text-muted); font-size:12px;">Indisponível</span>`;
        }

        html += `
            <tr>
                <td style="font-weight: 600; color: var(--navy-dark);">${r.quadraNome}</td>
                <td>${dataFormatada}</td>
                <td>${r.horario}</td>
                <td>
                    <span class="status-tag" style="${statusStyle}">${r.status}</span>
                </td>
                <td>${acoesHtml}</td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

// Cancelamento pelo usuário
window.cancelarReservaUsuario = function(reservaId) {
    showModal("danger", "Confirmar Cancelamento", "Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.", () => {
        const reservas = state.getReservas();
        const reserva = reservas.find(r => r.id === reservaId);
        if (reserva) {
            reserva.status = "Cancelada";
            state.saveReservas(reservas);
            renderUserReservations();
            showModal("success", "Reserva Cancelada", "A reserva foi cancelada com sucesso.");
        }
    }, true); // Exibe botão Cancelar na caixa de diálogo
};

// --- LOGICA DE PAGAMENTO PIX ---
const modalPix = document.getElementById("modal-pix");
const modalPixConfirmBtn = document.getElementById("modal-pix-confirm-btn");
const modalPixCloseBtn = document.getElementById("modal-pix-close-btn");
let idReservaSendoPaga = null;

window.fazerPagamento = function(reservaId) {
    idReservaSendoPaga = reservaId;
    modalPix.classList.add("active");
};

window.copiarChavePix = function() {
    const pixKeyInput = document.getElementById("pix-key-input");
    pixKeyInput.select();
    pixKeyInput.setSelectionRange(0, 99999); /* Para mobile */
    navigator.clipboard.writeText(pixKeyInput.value);
    
    showModal("success", "Pix Copiado", "Código Pix Copia e Cola copiado com sucesso para a área de transferência.");
};

// Fechar modal de PIX
modalPixCloseBtn.addEventListener("click", () => {
    modalPix.classList.remove("active");
    idReservaSendoPaga = null;
});

// Simular pagamento confirmado pelo usuário
modalPixConfirmBtn.addEventListener("click", () => {
    if (idReservaSendoPaga) {
        const reservas = state.getReservas();
        const reserva = reservas.find(r => r.id === idReservaSendoPaga);
        if (reserva) {
            reserva.status = "Confirmada";
            state.saveReservas(reservas);
            modalPix.classList.remove("active");
            idReservaSendoPaga = null;
            renderUserReservations();
            showModal("success", "Pagamento Confirmado", "Seu pagamento via PIX foi processado com sucesso. Sua quadra está confirmada!");
        }
    }
});


// --- TELA DE ADMINISTRAÇÃO ---
function renderAdminDashboard() {
    const tableBody = document.getElementById("admin-table-body");
    const metricReservasDia = document.getElementById("metric-reservas-dia");
    const metricQuadrasAtivas = document.getElementById("metric-quadras-ativas");
    
    const reservas = state.getReservas();
    const quadras = state.getQuadras();

    // 1. Atualizar Métricas
    // Contar reservas ativas de hoje (24/05/2025 para bater com wireframe ou do dia atual)
    const hojeData = "2025-05-24";
    const reservasDeHoje = reservas.filter(r => r.data === hojeData && r.status !== "Cancelada");
    
    // O total exibido na imagem é 8. Mostramos o número real baseado nas reservas de 24/05/2025 no banco.
    metricReservasDia.textContent = reservasDeHoje.length;
    metricQuadrasAtivas.textContent = quadras.length; // 6 quadras ativas

    // 2. Renderizar Tabela de Reservas de "Hoje" (24/05/2025)
    // Filtramos apenas as reservas do dia 24/05/2025
    const listaReservasAdmin = reservas.filter(r => r.data === hojeData);
    
    // Ordenar por hora
    listaReservasAdmin.sort((a, b) => a.horario.localeCompare(b.horario));

    if (listaReservasAdmin.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 30px; color: var(--text-muted);">
                    Nenhum agendamento para a data de hoje (${hojeData}).
                </td>
            </tr>
        `;
        return;
    }

    let html = "";
    listaReservasAdmin.forEach(r => {
        // Estilo do status badge
        let statusStyle = "";
        if (r.status === "Confirmada") {
            statusStyle = "background-color: var(--bg-success); color: var(--text-success);";
        } else if (r.status === "Pendente") {
            statusStyle = "background-color: var(--bg-pending); color: var(--text-pending);";
        } else if (r.status === "Cancelada" || r.status === "Rejeitada") {
            statusStyle = "background-color: var(--bg-danger); color: var(--text-danger);";
        } else if (r.status === "Bloqueada") {
            statusStyle = "background-color: var(--bg-inactive); color: var(--text-inactive);";
        }

        // Mostrar botões de ação se estiver Pendente ou Confirmada
        let acoesHtml = "";
        if (r.status === "Pendente") {
            acoesHtml = `
                <div class="admin-actions-cell">
                    <button class="icon-action-btn approve" onclick="adminAprovarReserva('${r.id}')" title="Aprovar">
                        <!-- Icon check -->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 16px; height: 16px;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                    <button class="icon-action-btn reject" onclick="adminRejeitarReserva('${r.id}')" title="Rejeitar">
                        <!-- Icon cross -->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 16px; height: 16px;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            `;
        } else if (r.status === "Confirmada") {
            acoesHtml = `
                <div class="admin-actions-cell">
                    <button class="icon-action-btn reject" onclick="adminRejeitarReserva('${r.id}')" title="Cancelar Reserva">
                        <!-- Icon cross -->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 16px; height: 16px;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <button class="icon-action-btn block-slot" onclick="adminBloquearReserva('${r.id}')" title="Bloquear Horário">
                        <!-- Icon block -->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 14px; height: 14px;">
                            <circle cx="12" cy="12" r="10" stroke-width="2.5"/>
                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke-width="2.5"/>
                        </svg>
                    </button>
                </div>
            `;
        } else {
            acoesHtml = `<span style="color: var(--text-muted); font-size:12px;">Sem ações</span>`;
        }

        html += `
            <tr>
                <td style="font-weight: 600; color: var(--navy-dark);">${r.horario}</td>
                <td>${r.quadraNome}</td>
                <td>${r.nomeUsuario}</td>
                <td>${r.telefone}</td>
                <td>
                    <span class="status-tag" style="${statusStyle}">${r.status}</span>
                </td>
                <td>${acoesHtml}</td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

// Ações do administrador
window.adminAprovarReserva = function(reservaId) {
    const reservas = state.getReservas();
    const r = reservas.find(item => item.id === reservaId);
    if (r) {
        r.status = "Confirmada";
        state.saveReservas(reservas);
        renderAdminDashboard();
        showModal("success", "Reserva Aprovada", "A reserva foi confirmada com sucesso.");
    }
};

window.adminRejeitarReserva = function(reservaId) {
    showModal("danger", "Rejeitar Reserva", "Tem certeza que deseja cancelar/rejeitar esta reserva?", () => {
        const reservas = state.getReservas();
        const r = reservas.find(item => item.id === reservaId);
        if (r) {
            r.status = "Cancelada";
            state.saveReservas(reservas);
            renderAdminDashboard();
            showModal("success", "Ação Concluída", "A reserva foi cancelada com sucesso.");
        }
    }, true);
};

window.adminBloquearReserva = function(reservaId) {
    showModal("danger", "Bloquear Horário", "Deseja bloquear este horário para manutenção ou uso interno?", () => {
        const reservas = state.getReservas();
        const r = reservas.find(item => item.id === reservaId);
        if (r) {
            r.status = "Bloqueada";
            r.nomeUsuario = "BLOQUEADO (Administrativo)";
            r.telefone = "-";
            state.saveReservas(reservas);
            renderAdminDashboard();
            showModal("success", "Horário Bloqueado", "Este horário está agora bloqueado para novas reservas.");
        }
    }, true);
};

// Botões do rodapé administrativo
document.getElementById("btn-gerenciar-quadras").addEventListener("click", () => {
    showModal("success", "Gerenciar Quadras", "Interface de gerenciamento de quadras (Nova quadra, edição) simulada. Todos os dados das quadras estão na variável QUADRAS_PADRAO no arquivo app.js.");
});

document.getElementById("btn-bloquear-horario").addEventListener("click", () => {
    // Bloquear um horário novo diretamente no admin
    const reservas = state.getReservas();
    const novoBloqueio = {
        id: "bloqueio-" + Date.now(),
        quadraId: "quadra-1",
        quadraNome: "Quadra 1 - Futsal",
        data: "2025-05-24",
        horario: "11:00 - 12:00",
        nomeUsuario: "BLOQUEADO (Administrativo)",
        telefone: "-",
        status: "Bloqueada"
    };
    reservas.push(novoBloqueio);
    state.saveReservas(reservas);
    renderAdminDashboard();
    showModal("success", "Horário Bloqueado", "O horário das 11:00 - 12:00 na Quadra 1 foi bloqueado com sucesso.");
});

document.getElementById("btn-relatorios").addEventListener("click", () => {
    showModal("success", "Relatórios Exportados", "Exportação de relatórios simulada com sucesso! (Reservas mensais, faturamento e quadras mais reservadas).");
});


// --- MODAL DIALOG COMPONENTE ---
let modalCallback = null;

function showModal(type, title, message, onConfirm = null, showCancel = false) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalCallback = onConfirm;

    // Estilizar o icone baseado no tipo
    if (type === "success") {
        modalIcon.className = "modal-icon-wrapper success";
        modalIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
        `;
    } else if (type === "danger" || type === "warning") {
        modalIcon.className = "modal-icon-wrapper danger";
        modalIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        `;
    }

    // Controlar botão cancelar
    if (showCancel) {
        modalCancelBtn.style.display = "block";
    } else {
        modalCancelBtn.style.display = "none";
    }

    modalOverlay.classList.add("active");
}

function hideModal() {
    modalOverlay.classList.remove("active");
}

modalConfirmBtn.addEventListener("click", () => {
    hideModal();
    if (modalCallback) {
        modalCallback();
    }
});

modalCancelBtn.addEventListener("click", () => {
    hideModal();
});


// 6. INICIALIZAÇÃO DA APLICAÇÃO
document.addEventListener("DOMContentLoaded", () => {
    // Iniciar na Página Inicial (Home)
    switchView("home");

    // Toggle menu mobile
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            navLinks.classList.toggle("open");
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener("click", (e) => {
            if (!navLinks.contains(e.target) && e.target !== mobileMenuToggle && !mobileMenuToggle.contains(e.target)) {
                navLinks.classList.remove("open");
            }
        });
        
        // Fechar menu ao clicar em algum link
        navLinks.querySelectorAll(".nav-item").forEach(item => {
            item.addEventListener("click", () => {
                navLinks.classList.remove("open");
            });
        });
    }
});

// Elementos do DOM
const elements = {
    // Configuração
    scriptInput: document.getElementById('scriptInput'),
    organizeBtn: document.getElementById('organizeBtn'),
    clockTime: document.getElementById('clockTime'),
    batteryLevel: document.getElementById('batteryLevel'),
    contactName: document.getElementById('contactName'),
    contactStatus: document.getElementById('contactStatus'),
    photoInput: document.getElementById('photoInput'),

    // Mensagens
    messageInput: document.getElementById('messageInput'),
    msgPhotoInput: document.getElementById('msgPhotoInput'),
    msgTime: document.getElementById('msgTime'),
    addMsgBtn: document.getElementById('addMsgBtn'),

    // Ferramentas
    toggleDeleteModeBtn: document.getElementById('toggleDeleteModeBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    tabBtns: document.querySelectorAll('.tab-btn'),

    // Preview
    statusBarTime: document.getElementById('statusBarTime'),
    batteryText: document.getElementById('batteryText'),
    batteryLevelDiv: document.querySelector('.battery-level'),
    headerProfilePic: document.getElementById('headerProfilePic'),
    headerNameDisplay: document.getElementById('headerNameDisplay'),
    headerStatusDisplay: document.getElementById('headerStatusDisplay'),
    chatArea: document.getElementById('chatArea'),
    captureArea: document.getElementById('captureArea')
};

// Estado
let currentMsgType = 'received'; // 'received' ou 'sent'
let isDeleteMode = false;

// Inicialização
function init() {
    setupEventListeners();
    updatePhoneStatus();
}

// Event Listeners
function setupEventListeners() {
    // Atualizações em tempo real
    elements.clockTime.addEventListener('input', updatePhoneStatus);
    elements.batteryLevel.addEventListener('input', updatePhoneStatus);
    elements.contactName.addEventListener('input', updateContactInfo);
    elements.contactStatus.addEventListener('input', updateContactInfo);

    // Foto de perfil
    elements.photoInput.addEventListener('change', handleProfilePhotoUpload);

    // Abas de tipo de mensagem
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMsgType = btn.dataset.type;
        });
    });

    // Adicionar mensagem manual
    elements.addMsgBtn.addEventListener('click', addManualMessage);

    // IA Organizar
    elements.organizeBtn.addEventListener('click', organizeScriptWithAI);

    // Toggle Delete Mode
    elements.toggleDeleteModeBtn.addEventListener('click', toggleDeleteMode);

    // Download
    elements.downloadBtn.addEventListener('click', downloadScreenshot);
}

// Atualizar Status do Celular
function updatePhoneStatus() {
    elements.statusBarTime.textContent = elements.clockTime.value;
    elements.batteryText.textContent = elements.batteryLevel.value + '%';
    elements.batteryLevelDiv.style.width = elements.batteryLevel.value + '%';
}

// Atualizar Info do Contato
function updateContactInfo() {
    elements.headerNameDisplay.textContent = elements.contactName.value;
    elements.headerStatusDisplay.textContent = elements.contactStatus.value;
}

// Upload de Foto de Perfil
function handleProfilePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            elements.headerProfilePic.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Adicionar Mensagem Manual
function addManualMessage() {
    const text = elements.messageInput.value.trim();
    const time = elements.msgTime.value;
    const photoFile = elements.msgPhotoInput.files[0];

    if (!text && !photoFile) {
        alert('Digite uma mensagem ou selecione uma foto!');
        return;
    }

    if (photoFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            renderMessage(text, currentMsgType, time, e.target.result);
        };
        reader.readAsDataURL(photoFile);
        // Limpar input de arquivo
        elements.msgPhotoInput.value = '';
    } else {
        renderMessage(text, currentMsgType, time, null);
    }

    elements.messageInput.value = '';
}

// Renderizar Mensagem no Chat
function renderMessage(text, type, time, imageUrl = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;

    if (imageUrl) {
        msgDiv.classList.add('has-image');
    }

    // Ícone de check (apenas para enviadas)
    const checkIcon = type === 'sent'
        ? `<span class="material-icons check-icon check-read">done_all</span>`
        : '';

    let contentHtml = '';

    if (imageUrl) {
        contentHtml += `<img src="${imageUrl}" class="message-image">`;
    }

    if (text) {
        contentHtml += `<span>${text.replace(/\n/g, '<br>')}</span>`;
    }

    msgDiv.innerHTML = `
        ${contentHtml}
        <div class="msg-meta">
            <span class="msg-time">${time}</span>
            ${checkIcon}
        </div>
    `;

    // Adicionar evento de clique para deletar (se modo exclusão estiver ativo)
    msgDiv.addEventListener('click', (e) => {
        if (isDeleteMode) {
            e.preventDefault();
            e.stopPropagation();
            msgDiv.remove();
        }
    });

    elements.chatArea.appendChild(msgDiv);
    elements.chatArea.scrollTop = elements.chatArea.scrollHeight;
}

// Toggle Delete Mode
function toggleDeleteMode() {
    isDeleteMode = !isDeleteMode;

    if (isDeleteMode) {
        elements.toggleDeleteModeBtn.textContent = '🗑️ Modo Exclusão: ON';
        elements.toggleDeleteModeBtn.style.background = '#b91c1c'; // Vermelho mais escuro
        elements.chatArea.classList.add('delete-mode');
    } else {
        elements.toggleDeleteModeBtn.textContent = '🗑️ Modo Exclusão: OFF';
        elements.toggleDeleteModeBtn.style.background = '#ef4444'; // Vermelho padrão
        elements.chatArea.classList.remove('delete-mode');
    }
}

// Lógica da IA (Simulada)
async function organizeScriptWithAI() {
    const script = elements.scriptInput.value.trim();
    if (!script) {
        alert('Por favor, cole um roteiro!');
        return;
    }

    elements.organizeBtn.textContent = 'Organizando...';
    elements.organizeBtn.disabled = true;

    // Simular processamento
    await new Promise(r => setTimeout(r, 1000));

    const lines = script.split('\n').filter(line => line.trim());
    let isSent = false; // Começa recebendo (padrão)
    let currentTime = new Date();
    currentTime.setHours(parseInt(elements.clockTime.value.split(':')[0]));
    currentTime.setMinutes(parseInt(elements.clockTime.value.split(':')[1]));

    lines.forEach(line => {
        let text = line.trim();
        let type = isSent ? 'sent' : 'received';

        // Detecção inteligente de remetente
        if (text.toLowerCase().startsWith('eu:') || text.toLowerCase().startsWith('me:')) {
            type = 'sent';
            text = text.replace(/^(eu|me):\s*/i, '');
            isSent = true;
        } else if (text.toLowerCase().startsWith('ele:') || text.toLowerCase().startsWith('ela:') || text.toLowerCase().startsWith('vc:')) {
            type = 'received';
            text = text.replace(/^(ele|ela|vc):\s*/i, '');
            isSent = false;
        } else {
            isSent = !isSent;
        }

        // Incrementar tempo (1-3 minutos)
        currentTime.setMinutes(currentTime.getMinutes() + Math.floor(Math.random() * 3) + 1);
        const timeStr = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;

        renderMessage(text, type, timeStr);
    });

    elements.organizeBtn.textContent = 'Organizar Conversa';
    elements.organizeBtn.disabled = false;
}

// Download Screenshot
// Download Screenshot
function downloadScreenshot() {
    // Desativar modo exclusão antes do print para não aparecer a lixeira
    const wasDeleteMode = isDeleteMode;
    if (wasDeleteMode) toggleDeleteMode();

    // Aguardar um pequeno delay para garantir que a UI atualizou (ex: removeu bordas vermelhas)
    setTimeout(() => {
        html2canvas(elements.captureArea, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'fake-chat-whatsapp.png';
            link.href = canvas.toDataURL('image/png');
            link.click();

            // Restaurar modo exclusão se estava ativo
            if (wasDeleteMode) toggleDeleteMode();
        });
    }, 100);
}

// Iniciar
init();

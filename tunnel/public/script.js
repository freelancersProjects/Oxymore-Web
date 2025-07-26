let currentTunnel = null;
let currentTarget = null;

async function loadStatus() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        
        currentTunnel = data.tunnel;
        currentTarget = data.target;
        
        updateUI();
    } catch (error) {
        console.error('Error loading status:', error);
    }
}

function updateUI() {
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const tunnelInfo = document.getElementById('tunnelInfo');
    const tunnelUrl = document.getElementById('tunnelUrl');
    
    if (currentTunnel) {
        statusIndicator.classList.add('active');
        statusText.textContent = `Tunnel actif - ${currentTarget === 'site' ? 'Oxymore Site' : 'Oxymore App'}`;
        tunnelInfo.style.display = 'block';
        tunnelUrl.textContent = currentTunnel;
        
        document.querySelectorAll('.target-card').forEach(card => {
            card.classList.remove('selected');
            if (card.dataset.target === currentTarget) {
                card.classList.add('selected');
            }
        });
    } else {
        statusIndicator.classList.remove('active');
        statusText.textContent = 'Aucun tunnel actif';
        tunnelInfo.style.display = 'none';
        
        document.querySelectorAll('.target-card').forEach(card => {
            card.classList.remove('selected');
        });
    }
}

async function selectTarget(target) {
    try {
        const response = await fetch('/api/start-tunnel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ target })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentTunnel = data.tunnelUrl;
            currentTarget = data.target;
            updateUI();
            
            showNotification(`Tunnel démarré pour ${target === 'site' ? 'Oxymore Site' : 'Oxymore App'}`, 'success');
            
            if (data.needsRestart) {
                showRestartNotification(target, data.ngrokHost);
            }
        } else {
            showNotification('Erreur lors du démarrage du tunnel', 'error');
        }
    } catch (error) {
        console.error('Error starting tunnel:', error);
        showNotification('Erreur de connexion', 'error');
    }
}

function showRestartNotification(target, ngrokHost) {
    const notification = document.createElement('div');
    notification.className = 'restart-notification';
    notification.innerHTML = `
        <div class="restart-content">
            <h3>⚠️ Redémarrage requis</h3>
            <p>Le fichier <code>vite.config.ts</code> a été configuré avec le host ngrok :</p>
            <div class="host-info"><code>${ngrokHost}</code></div>
            <p><strong>Veuillez redémarrer votre serveur ${target === 'site' ? 'Oxymore Site' : 'Oxymore App'} !</strong></p>
            <button onclick="this.parentElement.parentElement.remove()" class="close-restart">
                Compris
            </button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        backdrop-filter: blur(5px);
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .restart-content {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 2px solid #8b5cf6;
            border-radius: 16px;
            padding: 2rem;
            max-width: 500px;
            text-align: center;
            color: white;
        }
        .restart-content h3 {
            margin-bottom: 1rem;
            color: #f59e0b;
        }
        .restart-content p {
            margin-bottom: 1rem;
            line-height: 1.5;
        }
        .restart-content code {
            background: rgba(139, 92, 246, 0.2);
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            color: #8b5cf6;
        }
        .host-info {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: 8px;
            padding: 1rem;
            margin: 1rem 0;
            font-family: monospace;
        }
        .close-restart {
            background: #8b5cf6;
            color: white;
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .close-restart:hover {
            background: #7c3aed;
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
}

async function stopTunnel() {
    try {
        const response = await fetch('/api/stop-tunnel', {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentTunnel = null;
            currentTarget = null;
            updateUI();
            showNotification('Tunnel arrêté', 'success');
        } else {
            showNotification('Erreur lors de l\'arrêt du tunnel', 'error');
        }
    } catch (error) {
        console.error('Error stopping tunnel:', error);
        showNotification('Erreur de connexion', 'error');
    }
}

async function openLocal() {
    try {
        const response = await fetch('/api/open-browser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ target: currentTarget })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Ouvrir l\'application locale', 'success');
        } else {
            showNotification('Erreur lors de l\'ouverture', 'error');
        }
    } catch (error) {
        console.error('Error opening local:', error);
        showNotification('Erreur de connexion', 'error');
    }
}

function openTunnel() {
    if (currentTunnel) {
        window.open(currentTunnel, '_blank');
        showNotification('Tunnel ouvert dans un nouvel onglet', 'success');
    }
}

async function copyTunnelUrl() {
    if (currentTunnel) {
        try {
            await navigator.clipboard.writeText(currentTunnel);
            showNotification('URL copiée dans le presse-papiers', 'success');
        } catch (error) {
            fallbackCopyTextToClipboard(currentTunnel);
        }
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('URL copiée dans le presse-papiers', 'success');
    } catch (err) {
        showNotification('Erreur lors de la copie', 'error');
    }
    
    document.body.removeChild(textArea);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    loadStatus();
    
    setInterval(loadStatus, 5000);
}); 
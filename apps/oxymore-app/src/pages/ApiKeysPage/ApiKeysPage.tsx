import React, { useState } from "react";
import { OXMButton, OXMToast, OXMModal, OXMTabSwitcher } from "@oxymore/ui";
import "./ApiKeysPage.scss";

interface ApiKey {
  id: number;
  label: string;
  secret: string;
  createdAt: string;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

export default function ApiKeysPage() {
  const [tab, setTab] = useState("api");
  const [keys, setKeys] = useState<ApiKey[]>([
    { id: 1, label: "Primary Key", secret: "sk-xxxxxxxxxxxxxxxxxxxxx", createdAt: "2025-06-22" },
  ]);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [newKeyLabel, setNewKeyLabel] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<"input" | "display">("input");
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: Toast['type'] = "success") => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  const handleOpenGenerateModal = () => {
    setModalStep("input");
    setNewKeyLabel("");
    setNewKey(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmGenerateKey = () => {
    if (!newKeyLabel.trim()) {
        addToast("Please provide a label for the key.", "error");
        return;
    }
    const fakeKey = `sk-live-${Math.random().toString(36).slice(2)}`;
    const newItem: ApiKey = {
      id: Date.now(),
      label: newKeyLabel,
      secret: fakeKey,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setKeys([newItem, ...keys]);
    setNewKey(fakeKey);
    addToast("New API key generated successfully!");
    setModalStep("display");
  };

  const revokeKey = (id: number) => {
    setKeys(keys.filter((key) => key.id !== id));
    addToast("API key revoked.", "error");
  };

  const copyToClipboard = (text: string, successMessage: string) => {
    navigator.clipboard.writeText(text).then(() => {
      addToast(successMessage);
    });
  };

  return (
    <div className="api-keys-page">
      <OXMTabSwitcher
        tabs={[
          { label: "Mes clés API", value: "api" },
          { label: "Simulateur Premium", value: "premium" },
        ]}
        value={tab}
        onChange={setTab}
        className="api-keys-tabs"
      />
      {tab === "api" && (
        <>
          <div className="api-keys-explainer">
            <h2>Gérez vos clés API</h2>
            <p>
              Les clés API vous permettent d'accéder à nos services de façon sécurisée. Ne partagez jamais vos clés publiquement. Vous pouvez générer, révoquer et copier vos clés à tout moment. Pour des usages avancés ou des quotas plus élevés, essayez la version premium !
            </p>
          </div>
          <div className="toast-container">
            {toasts.map((toast) => (
              <OXMToast
                key={toast.id}
                message={toast.message}
                type={toast.type}
                onClose={() => removeToast(toast.id)}
              />
            ))}
          </div>

          <div className="header">
            <h1>API Keys</h1>
            <OXMButton onClick={handleOpenGenerateModal}>Generate New Key</OXMButton>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Label</th>
                  <th>Secret</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key) => (
                  <tr key={key.id}>
                    <td>{key.label}</td>
                    <td className="secret">
                      <span>••••••••••••••••••</span>
                      {key.secret.slice(-4)}
                    </td>
                    <td>{key.createdAt}</td>
                    <td className="actions">
                      <OXMButton
                        variant="secondary"
                        onClick={() => copyToClipboard(key.secret, "Secret key copied!")}
                      >
                        Copy
                      </OXMButton>
                      <OXMButton
                        variant="secondary"
                        onClick={() => revokeKey(key.id)}
                      >
                        Revoke
                      </OXMButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <OXMModal isOpen={isModalOpen} onClose={handleCloseModal}>
            {modalStep === "input" ? (
              <>
                <h2>Generate New API Key</h2>
                <p>Give your key a descriptive label to help you identify it later.</p>
                <div className="form-group">
                    <label htmlFor="key-label">Label</label>
                    <input
                        id="key-label"
                        type="text"
                        value={newKeyLabel}
                        onChange={(e) => setNewKeyLabel(e.target.value)}
                        placeholder="e.g., My Awesome Project"
                    />
                </div>
                <div className="modal-actions">
                    <OXMButton variant="secondary" onClick={handleCloseModal}>Cancel</OXMButton>
                    <OXMButton onClick={handleConfirmGenerateKey}>Generate Key</OXMButton>
                </div>
              </>
            ) : (
              <>
                <h2>New API Key Generated</h2>
                <p>Copy and store this key securely. You won't be able to see it again!</p>
                <div className="new-key">
                  <code>{newKey}</code>
                  <OXMButton onClick={() => copyToClipboard(newKey || "", "New key copied!")}>Copy Key</OXMButton>
                </div>
                <OXMButton variant="secondary" onClick={handleCloseModal}>Close</OXMButton>
              </>
            )}
          </OXMModal>
        </>
      )}
      {tab === "premium" && (
        <div className="premium-simulator">
          <h2>Simulateur Premium</h2>
          <div className="premium-info">
            <p>Découvrez les avantages de la version premium : plus de quotas, support prioritaire, accès à des endpoints exclusifs, gestion avancée des crédits…</p>
            <div className="premium-credits">
              <span>Crédits restants : <b>1200</b></span>
              <OXMButton variant="secondary">Acheter des crédits</OXMButton>
            </div>
            <div className="premium-key">
              <span>Votre clé premium :</span>
              <code>sk-premium-xxxxxxxxxxxxxxx</code>
              <OXMButton size="small">Copier</OXMButton>
            </div>
            <div className="premium-cta">
              <OXMButton>Passer à Premium</OXMButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import "./ApiKeysPage.scss";

export default function ApiKeysPage() {
  const [keys, setKeys] = useState([
    { id: 1, label: "Primary Key", secret: "sk-xxxxxxxxxxxxxxxxxxxxx", createdAt: "2025-06-22" },
  ]);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const generateKey = () => {
    const fakeKey = `sk-${Math.random().toString(36).substring(2, 20)}`;
    const newItem = {
      id: Date.now(),
      label: "New Key",
      secret: fakeKey,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setKeys([newItem, ...keys]);
    setNewKey(fakeKey);
    setIsModalOpen(true);
  };

  const revokeKey = (id: number) => {
    setKeys(keys.filter((key) => key.id !== id));
  };

  return (
    <div className="api-keys-page">
      <div className="header">
        <h1>API Keys</h1>
        <button onClick={generateKey}>Generate New Key</button>
      </div>

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
              <td className="secret">••••••••••••••••••</td>
              <td>{key.createdAt}</td>
              <td>
                <button onClick={() => navigator.clipboard.writeText(key.secret)}>Copy</button>
                <button onClick={() => revokeKey(key.id)}>Revoke</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>New API Key Generated</h2>
            <p>Copy and store this key securely. You won't be able to see it again!</p>
            <div className="new-key">
              <code>{newKey}</code>
              <button onClick={() => navigator.clipboard.writeText(newKey || "")}>Copy</button>
            </div>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

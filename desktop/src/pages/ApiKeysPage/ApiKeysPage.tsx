import { useState } from "react";
import { OXMButton } from "@oxymore/ui";
import "./ApiKeysPage.scss";

export default function ApiKeysPage() {
  const [keys] = useState([
    {
      id: 1,
      label: "Production Key",
      secret: "sk-prod-" + Math.random().toString(36).substring(2, 15),
      createdAt: "2025-01-15",
    },
    {
      id: 2,
      label: "Development Key",
      secret: "sk-dev-" + Math.random().toString(36).substring(2, 15),
      createdAt: "2025-01-10",
    },
  ]);

  const handleGenerateKey = () => {
    console.log("Generate new key clicked");
  };

  const handleCopyKey = (secret: string) => {
    navigator.clipboard.writeText(secret);
    console.log("Key copied:", secret);
  };

  const handleRevokeKey = (id: number) => {
    console.log("Revoke key:", id);
  };

  return (
    <div className="api-keys-page">
      <div className="page-header">
        <h2>API Keys</h2>
        <p>Manage your API keys for secure access to our services.</p>
      </div>

      <div className="api-keys-content">
        <div className="header">
          <h1>API Keys</h1>
          <OXMButton onClick={handleGenerateKey}>Generate New Key</OXMButton>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Label</th>
                <th>Secret</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr key={key.id}>
                  <td>{key.label}</td>
                  <td className="secret">{key.secret}</td>
                  <td>{key.createdAt}</td>
                  <td className="actions">
                    <OXMButton
                      variant="secondary"
                      onClick={() => handleCopyKey(key.secret)}
                    >
                      Copy
                    </OXMButton>
                    <OXMButton
                      variant="danger"
                      onClick={() => handleRevokeKey(key.id)}
                    >
                      Revoke
                    </OXMButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

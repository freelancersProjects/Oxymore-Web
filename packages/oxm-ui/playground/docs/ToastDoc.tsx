import React from "react";
import { useToast } from "../../src/OXM/OXM.Toast/useToast";
import Button from "../../src/OXM/OXM.Button/Button";
import "../styles/doc.scss";
import Toast from "../../src/OXM/OXM.Toast/Toast";

export default function ToastDoc() {
    const { showToast, toast, closeToast } = useToast();

    return (
      <section className="doc-section">
        <h1>OXM.Toast</h1>
        <p>Tester le toast :</p>
        <Button
          onClick={() => showToast("Hello, Oxymore toast !", "success", 5000)}
        >
          Afficher un toast
        </Button>
        <Button onClick={() => showToast("Erreur détectée", "error", 5000)}>
          Afficher une erreur
        </Button>
        <Button onClick={() => showToast("Erreur détectée", "info", 5000)}>
          Afficher une info
        </Button>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={closeToast}
            duration={toast.duration}
          />
        )}
      </section>
    );
}

import React, { type RefObject } from 'react';

interface InputProps {
  input: string;
  setInput: (val: string) => void;
  handleSend: (e: React.FormEvent) => void;
  isThinking: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const OxiaChatInput: React.FC<InputProps> = ({ input, setInput, handleSend, isThinking, inputRef }) => (
  <form className="oxia-chat-input-row" onSubmit={handleSend}>
    <input
      ref={inputRef}
      type="text"
      placeholder="Écris un message à Oxia..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      className="oxia-chat-input"
    />
    <button
      type="submit"
      className="oxia-chat-send-btn"
      disabled={isThinking}
    >
      Envoyer
    </button>
  </form>
);

export default OxiaChatInput;

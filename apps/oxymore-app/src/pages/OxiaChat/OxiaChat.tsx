import React, { useState, useRef, useEffect } from "react";
import "./OxiaChat.scss";
import { Bot, MessageSquare, Users } from "lucide-react";

const OXIA_PSEUDO = "Asukyy";

const mockChannels = [
  { id: 1, name: "General", icon: <MessageSquare size={18} /> },
  { id: 2, name: "Strategy", icon: <Users size={18} /> },
  { id: 3, name: "Oxia", icon: <Bot size={18} /> },
];

const initialMessages = [
  {
    id: 1,
    author: "Oxia",
    text: "Salut ! Je suis Oxia, ton IA d'équipe. Pose-moi une question ou demande-moi une analyse !",
    time: "11:17 PM",
    side: "left",
    avatar: "/oxymore.svg",
  },
];

function parseMarkdown(text: string): string {
  let html = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // gras
    .replace(/\n/g, "<br />"); // retour à la ligne
  // Listes numérotées
  html = html.replace(/\d+\. (.*?)(?=<br \/>|$)/g, "<li>$1</li>");
  if (html.includes("<li>")) {
    html = html.replace(/(<li>.*<\/li>)/gs, "<ol>$1</ol>");
  }
  return html;
}

const OxiaChat: React.FC = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingDots, setThinkingDots] = useState(".");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Animation des points "..."
  useEffect(() => {
    if (!isThinking) return;
    const interval = setInterval(() => {
      setThinkingDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 400);
    return () => clearInterval(interval);
  }, [isThinking]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    const userMsg = {
      id: Date.now(),
      author: "You",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      side: "right",
      avatar: "",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);
    setThinkingDots(".");

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/player/${OXIA_PSEUDO}/ask?prompt=${encodeURIComponent(
          userMsg.text
        )}`
      );
      const text = await res.text();
      console.log("Réponse brute IA:", text);
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { response: text };
      }
      const iaMsg = {
        id: Date.now() + 1,
        author: "Oxia",
        text: data?.response || "Je n'ai pas compris, peux-tu reformuler ?",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        side: "left",
        avatar: "/oxymore.svg",
      };
      setMessages((prev) => [...prev, iaMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          author: "Oxia",
          text: "Erreur lors de la connexion à l'IA.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          side: "left",
          avatar: "/oxymore.svg",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="oxia-chat-layout">
      <aside className="oxia-chat-sidebar">
        <div className="oxia-chat-sidebar__header">
          <Bot size={28} />
          <span className="oxia-chat-title">Oxia</span>
          <span className="oxia-beta-chip">Bêta</span>
        </div>
        <div className="oxia-chat-channels">
          <div className="oxia-chat-channels-title">Channels</div>
          <ul>
            {mockChannels.map((ch) => (
              <li key={ch.id} className={ch.name === "Oxia" ? "active" : ""}>
                {ch.icon}
                <span>{ch.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <section className="oxia-chat-main">
        <div className="oxia-chat-header">
          <div className="oxia-chat-header-title">
            <Bot size={22} /> Oxia Chat
          </div>
        </div>
        <div className="oxia-chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`oxia-message-bubble ${
                msg.side === "right"
                  ? "oxia-message-right"
                  : "oxia-message-left"
              }`}
              style={msg.side === "left" ? { maxWidth: 800 } : {}}
            >
              {msg.side === "left" && (
                <img src={msg.avatar} alt="Oxia" className="oxia-avatar" />
              )}
              <div className="oxia-message-content">
                {msg.side === "left" ? (
                  <div
                    className="oxia-message-text"
                    dangerouslySetInnerHTML={{
                      __html: parseMarkdown(msg.text),
                    }}
                  />
                ) : (
                  <div className="oxia-message-text">{msg.text}</div>
                )}
                <div className="oxia-message-meta">
                  <span className="oxia-message-author">{msg.author}</span>
                  <span className="oxia-message-time">{msg.time}</span>
                </div>
              </div>
            </div>
          ))}
          {/* Animation IA réfléchit... */}
          {isThinking && (
            <div className="oxia-message-bubble oxia-message-left thinking-bubble">
              <img src="/oxymore.svg" alt="Oxia" className="oxia-avatar" />
              <div className="oxia-message-content">
                <div className="oxia-message-text">
                  <span className="thinking-dots">
                    Oxia réfléchit{thinkingDots}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <form className="oxia-chat-input-row" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Écris un message à Oxia..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="oxia-chat-input"
            disabled={isThinking}
          />
          <button
            type="submit"
            className="oxia-chat-send-btn"
            disabled={isThinking}
          >
            Envoyer
          </button>
        </form>
      </section>
    </div>
  );
};

export default OxiaChat;

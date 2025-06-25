import React, { useState, useRef, useEffect } from "react";
import "./OxiaChat.scss";
import LogoOxia from "../../assets/images/Oxia.png";
import { Bot, Plus } from "lucide-react";
import { OXMModal } from "@oxymore/ui";

const OXIA_PSEUDO = "Asukyy";

interface Channel {
  id_channel: string;
  name: string;
  user_id: string;
  created_at: string;
  icon?: string;
}

interface Message {
  id: number;
  author: string;
  text: string;
  time: string;
  side: "left" | "right";
  avatar: string;
  channel_id?: string;
  user_id?: string;
  is_from_ai?: boolean;
}

const initialMessages: Message[] = [
  {
    id: 1,
    author: "Oxia",
    text: "Salut ! Je suis Oxia, ton IA d'équipe. Pose-moi une question ou demande-moi une analyse !",
    time: "11:17 PM",
    side: "left",
    avatar: LogoOxia,
  },
];

function parseMarkdown(text: string): string {
  // Remplace **gras** par <strong class="purple">
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="purple">$1</strong>');

  html = html.replace(/(^|\n)\d+\.\s([^\n:]+?)(\s*:\s*)(.*?)(?=\n|$)/g, (_match, p1, p2, p3, p4) => {
    // p2 = titre avant " :"
    // p3 = " :"
    // p4 = description après " :"
    return `${p1}<li><span><strong>${p2}</strong></span>${p3}${p4}</li>`;
  });

  // Si on a des <li>, on les entoure d'un <ol>
  if (html.includes('<li')) {
    html = html.replace(/((?:<li.*?>.*?<\/li>\s*)+)/gs, "<ol>$1</ol>");
  }

  // Retour à la ligne, mais pas après un </li> suivi d'un <br />
  html = html.replace(/<\/li>\s*<br\s*\/?>/g, "</li>");
  // Puis, retour à la ligne pour le reste
  html = html.replace(/\n/g, "<br />");
  return html;
}

const OxiaChat: React.FC = () => {
  const [channels, setChannels] = useState<Array<Channel>>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Array<Message>>(initialMessages);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingDots, setThinkingDots] = useState(".");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch channels on mount
  useEffect(() => {
    fetch("http://localhost:3000/api/channels")
      .then((res) => res.json())
      .then((data: Channel[]) => {
        setChannels(data);
        if (data.length > 0) setSelectedChannel(data[0]);
        else setSelectedChannel(null);
      });
  }, []);

  // Fetch messages when channel changes
  useEffect(() => {
    if (!selectedChannel) return;
    fetch(`http://localhost:3000/api/messages/channel/${selectedChannel.id_channel}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setMessages(data);
        else setMessages(initialMessages);
      });
  }, [selectedChannel]);

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
    if (!input.trim() || isThinking || !selectedChannel) return;

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    const userMsg: Message = {
      id: Date.now(),
      author: "You",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      side: "right",
      avatar: "",
      channel_id: selectedChannel.id_channel,
      user_id: "3ca6c0c1-9f69-486f-9129-7e235e518229", // à remplacer par l'id réel du user connecté
      is_from_ai: false,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);
    setThinkingDots(".");

    // Stocke le message côté back (user)
    const userMsgPayload = {
      channel_id: userMsg.channel_id,
      user_id: userMsg.user_id,
      content: userMsg.text,
      is_from_ai: false,
    };
    await fetch("http://localhost:3000/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userMsgPayload),
    });

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/player/${OXIA_PSEUDO}/ask?prompt=${encodeURIComponent(
          userMsg.text
        )}`
      );
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { response: text };
      }
      const iaMsg: Message = {
        id: Date.now() + 1,
        author: "Oxia",
        text: String(data?.response) || "Je n'ai pas compris, peux-tu reformuler ?",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        side: "left",
        avatar: LogoOxia,
        channel_id: selectedChannel.id_channel,
        is_from_ai: true,
      };
      setMessages((prev) => [...prev, iaMsg]);
      // Stocke le message IA côté back (envoie uniquement les champs attendus)
      const iaMsgPayload = {
        channel_id: iaMsg.channel_id,
        content: iaMsg.text,
        is_from_ai: true,
      };
      await fetch("http://localhost:3000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(iaMsgPayload),
      });
    } catch {
      const errorMsg: Message = {
        id: Date.now() + 1,
        author: "Oxia",
        text: "Erreur lors de la connexion à l'IA.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        side: "left",
        avatar: LogoOxia,
        channel_id: selectedChannel ? selectedChannel.id_channel : "",
        user_id: "3ca6c0c1-9f69-486f-9129-7e235e518229",
        is_from_ai: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleOpenModal = () => {
    setNewChannelName("");
    setIsModalOpen(true);
  };

  const handleCreateChannel = async () => {
    if (!newChannelName.trim()) return;
    // Crée le channel côté back
    const res = await fetch("http://localhost:3000/api/channels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newChannelName, user_id: "3ca6c0c1-9f69-486f-9129-7e235e518229" }), // Remplace USER_ID par l'id réel
    });
    const newChannel = await res.json();
    setChannels((prev) => [...prev, newChannel]);
    setSelectedChannel(newChannel);
    setIsModalOpen(false);
    // Ajoute le message IA de bienvenue dans ce channel
    const welcomeMsg = {
      id: Date.now(),
      author: "Oxia",
      text: initialMessages.length > 0 ? initialMessages[0].text : "Bienvenue sur ce channel !",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      side: "left" as "left",
      avatar: LogoOxia,
      channel_id: newChannel.id_channel,
      is_from_ai: true,
    };
    setMessages([welcomeMsg]);
    const welcomeMsgPayload = {
      channel_id: welcomeMsg.channel_id,
      content: welcomeMsg.text,
      is_from_ai: true,
    };
    await fetch("http://localhost:3000/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(welcomeMsgPayload),
    });
  };

  return (
    <div className="oxia-chat-layout">
      <aside className="oxia-chat-sidebar">
        <div className="oxia-chat-sidebar__header">
          <img src={LogoOxia} alt="Oxia Logo" className="oxia-chat-logo" />
          <span className="oxia-chat-title">Oxia</span>
          <span className="oxia-beta-chip">Bêta</span>
        </div>
        <div className="oxia-chat-channels">
          <div className="oxia-chat-channels-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Channels</span>
            <button className="oxia-add-channel-btn" onClick={handleOpenModal} title="Créer un channel" style={{ background: 'none', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, marginLeft: 8, cursor: 'pointer' }}>
              <Plus size={22} color="#fff" />
            </button>
          </div>
          <ul>
            {channels.map((ch) => (
              <li
                key={ch.id_channel}
                className={selectedChannel?.id_channel === ch.id_channel ? "active" : ""}
                onClick={() => setSelectedChannel(ch)}
              >
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
          {isThinking && (
            <div className="oxia-message-bubble oxia-message-left thinking-bubble">
              <img src={LogoOxia} alt="Oxia" className="oxia-avatar" />
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
      </section>
      <OXMModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Créer un nouveau channel</h2>
        <div className="form-group">
          <label htmlFor="channel-name">Nom du channel</label>
          <input
            id="channel-name"
            type="text"
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            placeholder="Nom du channel"
          />
        </div>
        <div className="modal-actions">
          <button className="oxia-chat-send-btn" onClick={handleCreateChannel}>
            Créer
          </button>
        </div>
      </OXMModal>
    </div>
  );
};

export default OxiaChat;

import React, { useState, useRef, useEffect } from "react";
import "./OxiaChat.scss";
import LogoOxia from "../../assets/images/Oxia.png";
import { Bot, Plus, MoreHorizontal } from "lucide-react";
import { OXMModal } from "@oxymore/ui";
import apiService from "../../api/apiService";
import OxiaChatSidebar from "./OxiaComponent/OxiaChatSidebar";
import OxiaChatMessages from "./OxiaComponent/OxiaChatMessages";
import OxiaChatInput from "./OxiaComponent/OxiaChatInput";
import OxiaChatModals from "./OxiaComponent/OxiaChatModals";
import { OXMToast } from "@oxymore/ui";

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
  let html = text.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="purple">$1</strong>'
  );

  html = html.replace(
    /(^|\n)\d+\.\s([^\n:]+?)(\s*:\s*)(.*?)(?=\n|$)/g,
    (_match, p1, p2, p3, p4) => {
      // p2 = titre avant " :"
      // p3 = " :"
      // p4 = description après " :"
      return `${p1}<li><span><strong>${p2}</strong></span>${p3}${p4}</li>`;
    }
  );

  // Si on a des <li>, on les entoure d'un <ol>
  if (html.includes("<li")) {
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
  const chatEndRef = useRef<HTMLDivElement>(
    null!
  ) as React.RefObject<HTMLDivElement>;
  const inputRef = useRef<HTMLInputElement>(
    null!
  ) as React.RefObject<HTMLInputElement>;
  const [channelMenuOpen, setChannelMenuOpen] = useState<string | null>(null);
  const [editChannelId, setEditChannelId] = useState<string | null>(null);
  const [editChannelName, setEditChannelName] = useState("");
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Fetch channels on mount
  useEffect(() => {
    apiService.get("/channels").then((data) => {
      setChannels(data);
      if (data.length > 0) setSelectedChannel(data[0] ?? null);
      else setSelectedChannel(null);
    });
  }, []);

  // Fetch messages when channel changes
  useEffect(() => {
    if (!selectedChannel) return;
    apiService
      .get(`/messages/channel/${selectedChannel.id_channel}`)
      .then((data) => {
        if (data.length > 0) {
          setMessages(
            data.map((msg: any, idx: number) => ({
              id: msg.id || idx + 1,
              author: msg.is_from_ai ? "Oxia" : "You",
              text: msg.content || msg.text || "",
              time:
                msg.time || msg.created_at
                  ? new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "",
              side: msg.is_from_ai ? "left" : "right",
              avatar: msg.is_from_ai ? LogoOxia : "",
              channel_id: msg.channel_id,
              user_id: msg.user_id,
              is_from_ai: msg.is_from_ai,
            }))
          );
        } else setMessages(initialMessages);
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
    await apiService.post("/messages", userMsgPayload);

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
        text:
          String(data?.response) || "Je n'ai pas compris, peux-tu reformuler ?",
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
      await apiService.post("/messages", iaMsgPayload);
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
    const newChannel = await apiService.post("/channels", {
      name: newChannelName,
      user_id: "3ca6c0c1-9f69-486f-9129-7e235e518229",
    });
    setChannels((prev) => [...prev, newChannel]);
    setSelectedChannel(newChannel);
    setIsModalOpen(false);
    // Ajoute le message IA de bienvenue dans ce channel
    const welcomeMsg = {
      id: Date.now(),
      author: "Oxia",
      text:
        initialMessages.length > 0
          ? initialMessages[0]?.text ?? "Bienvenue sur ce channel !"
          : "Bienvenue sur ce channel !",
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
    await apiService.post("/messages", {
      channel_id: welcomeMsg.channel_id,
      content: welcomeMsg.text,
      is_from_ai: true,
    });
    setToast({ message: "Channel créé avec succès", type: "success" });
  };

  // Fonction pour supprimer un channel
  const handleDeleteChannel = async (id_channel: string) => {
    await apiService.delete(`/channels/${id_channel}`);
    setChannels((prev) => prev.filter((ch) => ch.id_channel !== id_channel));
    if (selectedChannel?.id_channel === id_channel) setSelectedChannel(null);
    setShowDeleteModal(false);
    setEditChannelId(null);
    setToast({ message: "Channel supprimé avec succès", type: "success" });
  };

  // Fonction pour modifier le nom d'un channel
  const handleEditChannel = async (id_channel: string) => {
    if (!editChannelName.trim()) return;
    await apiService.patch(`/channels/${id_channel}`, {
      name: editChannelName,
    });
    setChannels((prev) =>
      prev.map((ch) =>
        ch.id_channel === id_channel ? { ...ch, name: editChannelName } : ch
      )
    );
    setShowRenameModal(false);
    setEditChannelId(null);
    setEditChannelName("");
    setToast({ message: "Channel renommé avec succès", type: "success" });
  };

  return (
    <div className="oxia-chat-layout">
      <OxiaChatSidebar
        channels={channels}
        selectedChannel={selectedChannel}
        setSelectedChannel={setSelectedChannel}
        onOpenModal={handleOpenModal}
        onRename={(ch) => {
          setEditChannelId(ch.id_channel);
          setEditChannelName(ch.name);
          setShowRenameModal(true);
        }}
        onDelete={(ch) => {
          setEditChannelId(ch.id_channel);
          setShowDeleteModal(true);
        }}
      />
      <section className="oxia-chat-main">
        {/* Loader si pas de channel sélectionné */}
        {!selectedChannel ? (
          <div className="oxia-chat-loader-container">
            <img
              src={LogoOxia}
              alt="Oxia Loader"
              className="oxia-chat-loader"
            />
            <div className="oxia-chat-loader-text">
              Crée un channel pour commencer à discuter avec Oxia !
            </div>
          </div>
        ) : (
          <>
            <div className="oxia-chat-header">
                <div className="oxia-chat-header-title">
                <Bot size={22} /> {selectedChannel?.name}
                </div>
            </div>
            <OxiaChatMessages
              messages={messages}
              isThinking={isThinking}
              thinkingDots={thinkingDots}
              chatEndRef={chatEndRef}
              parseMarkdown={parseMarkdown}
            />
            <OxiaChatInput
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              isThinking={isThinking}
              inputRef={inputRef}
            />
          </>
        )}
      </section>
      <OxiaChatModals
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        newChannelName={newChannelName}
        setNewChannelName={setNewChannelName}
        handleCreateChannel={handleCreateChannel}
        showRenameModal={showRenameModal}
        setShowRenameModal={setShowRenameModal}
        editChannelName={editChannelName}
        setEditChannelName={setEditChannelName}
        handleEditChannel={() => handleEditChannel(editChannelId!)}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handleDeleteChannel={() => handleDeleteChannel(editChannelId!)}
      />
      {/* Toast en haut à droite */}
      <div
        style={{
          position: "fixed",
          top: 32,
          right: 32,
          zIndex: 9999,
          minWidth: 320,
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <div className="toast-container">
          {toast && (
            <OXMToast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
              duration={3000}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OxiaChat;

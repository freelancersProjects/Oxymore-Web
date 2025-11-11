import React from 'react';
import LogoOxia from '../../../assets/images/Oxia.png';

interface Message {
  id: number;
  author: string;
  text: string;
  time: string;
  side: 'left' | 'right';
  avatar: string;
  channel_id?: string;
  user_id?: string;
  is_from_ai?: boolean;
}

interface MessagesProps {
  messages: Message[];
  isThinking: boolean;
  thinkingDots: string;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  parseMarkdown: (text: string) => string;
}

const OxiaChatMessages: React.FC<MessagesProps> = ({ messages, isThinking, thinkingDots, chatEndRef, parseMarkdown }) => (
  <div className="oxia-chat-messages">
    {messages.map((msg) => (
      <div
        key={msg.id}
        className={`oxia-message-bubble ${msg.side === "right" ? "oxia-message-right" : "oxia-message-left"}`}
        style={msg.side === "left" ? { maxWidth: 800 } : {}}
      >
        {msg.side === "left" && (
          <img src={msg.avatar} alt="Oxia" className="oxia-avatar" />
        )}
        <div className="oxia-message-content">
          {msg.side === "left" ? (
            <div
              className="oxia-message-text"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
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
);

export default OxiaChatMessages;

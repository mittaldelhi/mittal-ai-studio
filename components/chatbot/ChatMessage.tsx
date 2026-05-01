"use client";

import Image from "next/image";

export type LocalChatMessage = {
  id: string;
  sender: "user" | "bot";
  text: string;
};

export function ChatMessage({ message }: { message: LocalChatMessage }) {
  const isBot = message.sender === "bot";

  return (
    <div className={`chatbot-message-row ${isBot ? "bot" : "user"}`}>
      {isBot ? (
        <div className="chatbot-avatar logo">
          <Image alt="Mittal AI M logo" height={32} src="/mittal-ai-m-clean.png" width={32} />
        </div>
      ) : null}
      <div className="chatbot-bubble">
        {message.text.split("\n").map((line, index) => (
          <p key={`${message.id}-${index}`}>{line}</p>
        ))}
      </div>
      {!isBot ? <div className="chatbot-user-avatar">You</div> : null}
    </div>
  );
}

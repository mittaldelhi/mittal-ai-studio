"use client";

export function TypingIndicator() {
  return (
    <div className="chatbot-message-row bot">
      <div className="chatbot-avatar">M</div>
      <div className="chatbot-typing" aria-label="Assistant is typing">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

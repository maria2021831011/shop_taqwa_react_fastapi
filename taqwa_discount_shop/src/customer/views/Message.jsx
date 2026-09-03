// Message.js (Enhanced Component)
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import "./Message.css";

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  const fetchMessages = async () => {
    try {
      const res = await axios.get("https://shop-taqwa-react-fastapi-2.onrender.com/messages/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(res.data.reverse()); // Show latest first
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    setSending(true);
    try {
      await axios.post(
        "https://shop-taqwa-react-fastapi-2.onrender.com/messages/send",
        { message: text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setText("");
      await fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="messages-container">
      {/* Header */}
      <div className="messages-header">
        <div className="header-content">
          <h1>💬 Message Center</h1>
          <div className="message-stats">
            <span className="stat-badge">
              📩 {messages.length} {messages.length === 1 ? 'Message' : 'Messages'}
            </span>
          </div>
        </div>
        <p className="header-subtitle">Chat with our support team or view your message history</p>
      </div>

      {/* Messages Container */}
      <div className="messages-box">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No messages yet</h3>
            <p>Start a conversation by sending your first message below!</p>
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <div key={m.id} className="message-item">
                <div className="message-avatar">
                  {m.sender === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-sender">
                      {m.sender === 'user' ? 'You' : 'Support Team'}
                    </span>
                    <span className="message-time">
                      {formatDate(m.created_at)}
                    </span>
                  </div>
                  <div className="message-bubble">
                    <p>{m.message}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="message-input-container">
        <div className="input-wrapper">
          <div className="text-area-container">
            <textarea
              placeholder="Type your message here... Press Enter to send"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sending}
              rows="3"
            />
            <div className="input-actions">
              <span className="char-count">
                {text.length}/500
              </span>
            </div>
          </div>
          <button 
            onClick={sendMessage} 
            disabled={!text.trim() || sending}
            className="send-button"
          >
            {sending ? (
              <>
                <span className="button-spinner"></span>
                Sending...
              </>
            ) : (
              <>
                Send
                <span className="send-icon">✈️</span>
              </>
            )}
          </button>
        </div>
       
      </div>
    </div>
  );
};

export default Message;

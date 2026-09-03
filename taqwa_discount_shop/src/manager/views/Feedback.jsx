import { useEffect, useState } from "react";
import {
  MessageSquare,
  Send,
  User,
  Mail,
  Clock,
  Search,
  Reply,
  X,
  CheckCircle
} from "lucide-react";
import "./Feedback.css";

const Feedback = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // recent, customer
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replySending, setReplySending] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchAllMessages();
    const interval = setInterval(fetchAllMessages, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAllMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://shop-taqwa-react-fastapi-2.onrender.com/messages/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
      setError(null);
    } catch (_err) {
      setError("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const sendReply = async () => {
    if (!replyText.trim()) return;

    setReplySending(true);
    try {
      await fetch("https://shop-taqwa-react-fastapi-2.onrender.com/messages/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          customer_email: selectedMessage.customer_email,
          reply: replyText
        })
      });

      setSuccessMessage("Reply sent successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      setReplyText("");
      setSelectedMessage(null);
      fetchAllMessages();
    } catch (_err) {
      alert("Error sending reply");
    } finally {
      setReplySending(false);
    }
  };

  // Filter messages
  const filteredMessages = messages.filter(msg => {
    const matchesSearch = 
      msg.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.customer_name && msg.customer_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Group messages by customer
  const groupedMessages = {};
  filteredMessages.forEach(msg => {
    const key = msg.customer_email;
    if (!groupedMessages[key]) {
      // Extract name from email if customer_name is not provided
      const nameFromEmail = msg.customer_email.split("@")[0].replace(/[._]/g, " ");
      groupedMessages[key] = {
        email: msg.customer_email,
        name: msg.customer_name || nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
        messages: []
      };
    }
    groupedMessages[key].messages.push(msg);
  });

  const customerGroups = Object.values(groupedMessages);

  // Sort customers
  if (sortBy === "recent") {
    customerGroups.sort((a, b) => {
      const aLatest = Math.max(...a.messages.map(m => new Date(m.created_at)));
      const bLatest = Math.max(...b.messages.map(m => new Date(m.created_at)));
      return bLatest - aLatest;
    });
  } else if (sortBy === "customer") {
    customerGroups.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Statistics
  const stats = {
    totalMessages: messages.length,
    totalCustomers: new Set(messages.map(m => m.customer_email)).size,
    unreadCount: 0
  };

  return (
    <div className="feedback-container">
      {/* Header */}
      <div className="feedback-header">
        <div className="header-content">
          <h2>💬 Customer Messages & Feedback</h2>
          <p className="header-subtitle">Manage customer messages and send replies</p>
        </div>
        <button className="refresh-btn" onClick={fetchAllMessages} disabled={loading}>
          🔄 Refresh
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-banner">
          <CheckCircle size={20} />
          {successMessage}
        </div>
      )}

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">💬</span>
          <div>
            <span className="stat-label">Total Messages</span>
            <span className="stat-value">{stats.totalMessages}</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <div>
            <span className="stat-label">Total Customers</span>
            <span className="stat-value">{stats.totalCustomers}</span>
          </div>
        </div>
        <div className="stat-card unread">
          <span className="stat-icon">🔔</span>
          <div>
            <span className="stat-label">Unread</span>
            <span className="stat-value">{stats.unreadCount}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by customer name, email, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sort-group">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recent">Most Recent</option>
            <option value="customer">Customer Name</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && <div className="loading-message">Loading messages...</div>}

      {/* Error State */}
      {error && <div className="error-banner">{error}</div>}

      {/* Messages Grid */}
      {!loading && customerGroups.length > 0 && (
        <div className="messages-grid">
          {customerGroups.map((customer) => (
            <div key={customer.email} className="customer-card">
              {/* Customer Header */}
              <div className="customer-header">
                <div className="customer-info">
                  <div className="avatar">{customer.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <h3 className="customer-name">{customer.name}</h3>
                    <p className="customer-email">
                      <Mail size={14} />
                      {customer.email}
                    </p>
                  </div>
                </div>
                <div className="message-count">{customer.messages.length} message{customer.messages.length !== 1 ? "s" : ""}</div>
              </div>

              {/* Messages */}
              <div className="messages-list">
                {customer.messages.map((msg) => (
                  <div key={msg.id} className="message-item">
                    <div className="message-content">
                      <p className="message-text">{msg.message}</p>
                      <span className="message-time">
                        <Clock size={12} />
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                    <button
                      className="btn-reply"
                      onClick={() => setSelectedMessage(msg)}
                      title="Reply to this message"
                    >
                      <Reply size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && customerGroups.length === 0 && (
        <div className="empty-state">
          <MessageSquare size={48} />
          <p>No messages found</p>
          {searchTerm && <p className="empty-hint">Try adjusting your search terms</p>}
        </div>
      )}

      {/* Reply Modal */}
      {selectedMessage && (
        <div className="modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reply to Customer</h3>
              <button className="btn-close" onClick={() => setSelectedMessage(null)}>
                <X size={20} />
              </button>
            </div>

            {/* Customer Message Preview */}
            <div className="original-message">
              <div className="preview-header">
                <User size={16} />
                <span>{selectedMessage.customer_email}</span>
              </div>
              <p className="preview-text">{selectedMessage.message}</p>
              <span className="preview-time">
                {new Date(selectedMessage.created_at).toLocaleString()}
              </span>
            </div>

            {/* Reply Input */}
            <div className="reply-section">
              <label>Your Reply:</label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply message here..."
                rows="5"
              />
              <div className="reply-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setSelectedMessage(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn-send"
                  onClick={sendReply}
                  disabled={replySending || !replyText.trim()}
                >
                  <Send size={16} />
                  {replySending ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;

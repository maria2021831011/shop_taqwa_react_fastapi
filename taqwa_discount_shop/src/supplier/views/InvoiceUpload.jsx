import { useState, useEffect } from "react";

const InvoiceUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [invoices, setInvoices] = useState([]);

  const token = localStorage.getItem("token");

  const fetchInvoices = async () => {
    if (!token) return;
    try {
      const res = await fetch("https://shop-taqwa-react-fastapi-2.onrender.com/invoices/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setInvoices(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("invoice", file);

    try {
      const res = await fetch("https://shop-taqwa-react-fastapi-2.onrender.com/invoices/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Invoice uploaded successfully");
        setFile(null);
        fetchInvoices(); // refresh the list
      } else {
        setMessage(`❌ ${data.detail || "Upload failed"}`);
      }
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Upload Invoice</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload Invoice</button>
      </form>
      {message && <p>{message}</p>}

      <h3>My Invoices</h3>
      {invoices.length === 0 ? (
        <p>No invoices uploaded yet.</p>
      ) : (
        <ul>
          {invoices.map((inv) => (
            <li key={inv.id}>
              <a href={inv.file_path} target="_blank" rel="noopener noreferrer">
                {inv.filename}
              </a>{" "}
              - uploaded at {new Date(inv.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InvoiceUpload;

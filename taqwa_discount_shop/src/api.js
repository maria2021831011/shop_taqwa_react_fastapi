import axios from "axios";

export default axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://shop-taqwa-react-fastapi-2.onrender.com",
});
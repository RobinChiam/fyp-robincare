import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export async function storeHash(recordId, recordHash) {
    const response = await axios.post(`${API_BASE_URL}/storeHash`, { recordId, recordHash });
    return response.data;
}

export async function getHash(recordId) {
    const response = await axios.get(`${API_BASE_URL}/getHash/${recordId}`);
    return response.data;
}

import axios from "axios";

export const test_connect = async () => {
    return await axios.get(import.meta.env.VITE_API + "/testConnect")
}

export const login = async (data) =>
    await axios.post(import.meta.env.VITE_API + "/login", data);

export const register = async (data) =>
    await axios.post(import.meta.env.VITE_API + "/register", data)

export const new_profile = async (id, data) => 
    await axios.put(import.meta.env.VITE_API + "/profile/" + id, data)

export const get_profile = async (id) => {
    return await axios.get(import.meta.env.VITE_API + "/profile/" + id)
}

export const new_section = async (id) =>
    await axios.post(import.meta.env.VITE_API + "/section/" + id)

export const get_section = async (id) => {
    return await axios.get(import.meta.env.VITE_API + "/section/" + id)
}

export const del_section = async (id) =>
    await axios.delete(import.meta.env.VITE_API + "/section/" + id)

export const new_message = async (id, data) =>
    await axios.post(import.meta.env.VITE_API + "/history/" + id, data)

export const get_history = async (id) => {
    return await axios.get(import.meta.env.VITE_API + "/history/" + id)
}

export const test_chatbot = async (data) =>
    await axios.post(import.meta.env.VITE_API + "/history", data)

export const create_report = async (data) =>
    await axios.post(import.meta.env.VITE_API + "/report", data)

export const get_notification = async () => {
    return await axios.get(import.meta.env.VITE_API + "/notifications")
}

export const del_notification = async (id) =>
    await axios.delete(import.meta.env.VITE_API + "/notifications/" + id)
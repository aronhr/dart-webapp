import { io } from "socket.io-client";
const config = useRuntimeConfig();
export const socket = io(config.public.SOCKET_SERVER_URL);

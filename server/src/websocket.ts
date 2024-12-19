import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";

interface ConnectedUser {
  userId: string;
  socketId: string;
  role: string;
}

export class WebSocketServer {
  private io: Server;
  private connectedUsers: ConnectedUser[] = [];

  constructor(httpServer: HTTPServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
      },
    });

    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          throw new Error("Authentication error");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        socket.data.userId = decoded.id;
        socket.data.role = decoded.role;
        next();
      } catch (error) {
        next(new Error("Authentication error"));
      }
    });

    this.io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      // Add user to connected users
      this.connectedUsers.push({
        userId: socket.data.userId,
        socketId: socket.id,
        role: socket.data.role,
      });

      // Handle private messages
      socket.on("private_message", async (data) => {
        const { to, message } = data;
        const recipient = this.connectedUsers.find(
          (user) => user.userId === to
        );

        if (recipient) {
          this.io.to(recipient.socketId).emit("private_message", {
            from: socket.data.userId,
            message,
            timestamp: new Date(),
          });
        }
      });

      // Handle notifications
      socket.on("send_notification", (data) => {
        const { to, type, content } = data;
        const recipient = this.connectedUsers.find(
          (user) => user.userId === to
        );

        if (recipient) {
          this.io.to(recipient.socketId).emit("notification", {
            type,
            content,
            from: socket.data.userId,
            timestamp: new Date(),
          });
        }
      });

      // Handle typing indicators
      socket.on("typing", (data) => {
        const { to } = data;
        const recipient = this.connectedUsers.find(
          (user) => user.userId === to
        );

        if (recipient) {
          this.io.to(recipient.socketId).emit("typing", {
            from: socket.data.userId,
          });
        }
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        this.connectedUsers = this.connectedUsers.filter(
          (user) => user.socketId !== socket.id
        );
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  // Method to emit events to specific users
  public emitToUser(userId: string, event: string, data: any) {
    const recipient = this.connectedUsers.find(
      (user) => user.userId === userId
    );
    if (recipient) {
      this.io.to(recipient.socketId).emit(event, data);
    }
  }

  // Method to broadcast events to all connected users
  public broadcast(event: string, data: any) {
    this.io.emit(event, data);
  }
}

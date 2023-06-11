import { socketServer } from "../app.js";
import { messageService } from "../dao/managers/factory.js";

export const renderChat = async (req, res) => {
    try {
      let messages = await messageService.getAll(); 
      res.render("chat", { messages: messages });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error, message: "Nothing to see here" });
    }
  }

  export const sendMSG = (req, res) => {
    socketServer.on("connection", async (socket) => {
      try {
        let msg = await messageService.save(req.body);
        let chat = await messageService.getAll();
        socketServer.emit("messages", chat);
        res.render("chat", { messages: [] });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "Nothing to see here" });
      }
    });
  }
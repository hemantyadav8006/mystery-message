import { userRepository } from "@/repositories/user.repository";
import { ForbiddenError, NotFoundError } from "@/lib/errors";
import type { IMessage } from "@/model/User.model";

export const messageService = {
  async sendMessage(username: string, content: string) {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!user.isAcceptingMessages) {
      throw new ForbiddenError("This user is not accepting messages");
    }

    const message: IMessage = { content, createdAt: new Date() };
    await userRepository.addMessage(user._id.toString(), message);

    return { message: "Message sent successfully" };
  },

  async getMessages(userId: string) {
    const messages = await userRepository.getMessagesSorted(userId);
    return messages;
  },

  async deleteMessage(userId: string, messageId: string) {
    const result = await userRepository.deleteMessage(userId, messageId);

    if (result.modifiedCount === 0) {
      throw new NotFoundError("Message not found or already deleted");
    }

    return { message: "Message deleted" };
  },

  async getAcceptStatus(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return { isAcceptingMessages: user.isAcceptingMessages };
  },

  async updateAcceptStatus(userId: string, acceptMessages: boolean) {
    const user = await userRepository.updateAcceptingMessages(userId, acceptMessages);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return { message: "Message acceptance status updated successfully" };
  },
};

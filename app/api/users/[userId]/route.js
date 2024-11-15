import Chat from "@models/Chat";
import Message from "@models/Message";
import User from "@models/User";
import { connectToDB } from "@mongodb";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const { userId } = params;

    const allChats = await Chat.find({ members: userId })
      .sort({
        lastMessageAt: -1, // desc order
      })
      .populate({
        path: "members",
        model: User,
      })
      .populate({
        path: "messages",
        model: Message,
        populate: {
          path: "sender seenBy",
          model: User,
        },
      })
      .exec();

    return new Response(JSON.stringify(allChats), { status: 200 });
  } catch (error) {
    console.error("Failed to GET allChats of current user : ", error.message);
    return new Response("Failed to get all chats of current user", {
      status: 500,
    });
  }
};

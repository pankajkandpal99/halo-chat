import User from "@models/User";
import { connectToDB } from "@mongodb";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const { query } = params;

    // The find method is using MongoDB's $or operator to look for matches in either the username or email fields of the User collection. So, User.find() is looking for users whose username or email contains the specified query value, regardless of uppercase or lowercase letters.
    const searchedContact = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } }, // The $regex keyword in MongoDB is used to perform pattern matching in queries.
        { email: { $regex: query, $options: "i" } },
      ],
    }); // { $regex: query, $options: "i" } is a MongoDB regular expression query that matches any document where the username or email fields contain the query string, ignoring case ($options: "i" makes the search case-insensitive).

    return new Response(JSON.stringify(searchedContact), { status: 200 });
  } catch (error) {
    return new Response("Failed to search contact", { status: 500 });
  }
};

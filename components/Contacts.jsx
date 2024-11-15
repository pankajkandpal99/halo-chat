"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "./Loader";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const Contacts = () => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const { data: session } = useSession(); // get loggedIn user from next-auth
  const currentUser = session?.user;

  const getContacts = async () => {
    try {
      const res = await fetch(
        search !== "" ? `/api/users/searchContact/${search}` : `/api/users`
      );
      const data = await res.json();

      setContacts(data.filter((contact) => contact._id !== currentUser._id));
    } catch (error) {
      toast.error(error.message || "Failed to get contacts.");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (currentUser) {
      getContacts();
    }
  }, [currentUser, search]);

  // Select Contact....
  const [selectedContacts, setSelectedContacts] = useState([]);
  const isGroup = selectedContacts.length > 1;

  const [name, setName] = useState(); // ADD Group Chat Name

  const handleSelect = (contact) => {
    if (selectedContacts.includes(contact)) {
      setSelectedContacts((prevSelectedContacts) =>
        prevSelectedContacts.filter((item) => item !== contact)
      );
    } else {
      setSelectedContacts((prevSelectedContacts) => [
        ...prevSelectedContacts,
        contact,
      ]);
    }
  };

  // Create Chat
  const createChat = async () => {
    const res = await fetch(`/api/chats`, {
      method: "POST",
      body: JSON.stringify({
        currentUserId: currentUser._id,
        members: selectedContacts.map((contact) => contact._id),
        isGroup,
        name,
      }),
    });

    const chat = await res.json();
    if (res.ok) {
      router.push(`/chats/${chat._id}`);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="create-chat-container">
      <input
        type="text"
        className="input-search"
        placeholder="Search contact..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="contact-bar">
        <div className="contact-list">
          <p className="text-body-bold">Select or Deselect</p>
          {contacts.length > 0 ? (
            contacts.map((user, idx) => {
              return (
                <div
                  key={idx}
                  className="contact"
                  onClick={() => handleSelect(user)}
                >
                  {selectedContacts.find((item) => item === user) ? (
                    <CheckCircle sx={{ color: "red" }} />
                  ) : (
                    <RadioButtonUnchecked />
                  )}
                  <img
                    src={user.profileImage || "/assets/person.jpg"}
                    alt="profile"
                    className="profilePhoto"
                  />
                  <p className="text-base-bold">{user.username}</p>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No contact found</p>
          )}
        </div>

        <div className="create-chat">
          {isGroup && (
            <>
              <div className="flex flex-col gap-3">
                <p className="text-body-bold">Group Chat Name</p>
                <input
                  type="text"
                  placeholder="Enter your group chat name..."
                  className="input-group-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-body-bold">Members</p>
                <div className="flex flex-wrap gap-3">
                  {selectedContacts.map((contact, index) => (
                    <p className="selected-contact" key={index}>
                      {contact.username}
                    </p>
                  ))}
                </div>
              </div>
            </>
          )}
          <button className="btn uppercase" onClick={createChat}>
            Find or Start a new chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contacts;

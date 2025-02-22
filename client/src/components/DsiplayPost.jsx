import React from "react";
import { Dialog } from "@headlessui/react"; 

const DisplayPost = ({ open, setOpen, post }) => {
    console.log (post);
  if (!post) {
    return <p className="text-center text-gray-500">No post selected</p>;
  }

  return (
    <Dialog open={open} onClose={setOpen} className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{post.title}</h2>
      {post.image && (
        <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-md mb-4" />
      )}
      <p className="text-gray-600 mb-4">{post.content}</p>
      <div className="flex justify-between items-center text-gray-500 text-sm">
        <span>By {post.author}</span>
        <span>{new Date(post.date).toLocaleDateString()}</span>
      </div>
    </Dialog>
  );
};

export default DisplayPost;
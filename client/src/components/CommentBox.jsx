import { motion } from "framer-motion";

const CommentBox = ({ text }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-4 bg-white shadow-lg rounded-2xl max-w-md mx-auto mt-4"
    >
      <p className="text-gray-800">{text}</p>
    </motion.div>
  );
};

export default CommentBox;

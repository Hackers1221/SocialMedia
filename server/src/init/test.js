const mongoose = require("mongoose");
const User = require("../models/user.model.js");
const Post = require("../models/posts.model.js")
const { sampleUsers } = require("./userData.js");
const { samplePosts } = require("./postData.js")
const { Mongo_DB_URL } = require('../config/db.config.js');

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb+srv://rounakkumar190504:GiEbVkpEioO5K1j0@socialmedia.qt7ge.mongodb.net/");
}

const initDB = async () => {
  await User.deleteMany({});

  for (const ele of sampleUsers) {
    await User.create(ele);
  }
  console.log("user data was initialized");

  const data = await User.find({});
  let objectIds = data.map((ele) => (String(ele._id)));

  // Get any random id from list
  const getRandomId = () => objectIds[Math.floor(Math.random() * objectIds.length)];

  const posts = samplePosts.map((ele) => ({ ...ele, userId: getRandomId(), caption: "festive vibes"}));
  await Post.deleteMany({});
  await Post.insertMany(posts);
  console.log("posts was initialized");
};

initDB();
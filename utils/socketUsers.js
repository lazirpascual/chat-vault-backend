// add unique user
const addUser = (userId, socketId, users) => {
  // if the user is unique, add it to the array
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

// remove a user
const removeUser = (socketId, users) => {
  return users.filter((user) => user.socketId !== socketId);
};

// fetch a user
const getUser = (userId, users) => {
  return users.find((user) => user.userId === userId);
};

module.exports = { addUser, removeUser, getUser };

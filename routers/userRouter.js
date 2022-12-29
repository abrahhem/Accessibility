const Router = require("express");
const { usersController } = require('../controllers/usersController');

const userRouter = new Router();

userRouter.get("/:email", usersController.getUserByEmail);
userRouter.get('/', usersController.getAllUsers);

userRouter.put("/", usersController.editUser);

userRouter.post("/", usersController.addUser);

userRouter.delete("/",usersController.deleteUser);

module.exports =  { userRouter };
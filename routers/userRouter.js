const Router = require("express");
const { usersController } = require('../controllers/usersController');

const userRouter = new Router();

userRouter.get("/:id", usersController.getUserByID);
userRouter.get('/', usersController.getAllUsers);

userRouter.put("/:id", usersController.editUser);

userRouter.post("/", usersController.addUser);

userRouter.delete("/:id",usersController.deleteUser);

module.exports =  { userRouter };
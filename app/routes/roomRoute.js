const { getRooms,getRoomInfo, createRoom, joinRoom, leaveRoom, endRoom } = require('../controllers/roomController')
const { roomValidator, verifyToken } = require('./../middlewares/validatorMiddleware')
const { checkValidationError } = require('./../helpers/validatorError')
const express = require('express')
const roomRouter = express.Router()

roomRouter.get('/get_rooms', getRooms)
roomRouter.post('/get_room_info', verifyToken, getRoomInfo)
roomRouter.post('/create_room', verifyToken, roomValidator(), checkValidationError, createRoom)
roomRouter.post('/end_room', verifyToken, endRoom)
roomRouter.post('/join_room', verifyToken, joinRoom)
roomRouter.post('/leave_room', verifyToken, leaveRoom)

module.exports = roomRouter;
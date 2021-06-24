const configurations = require('./../config')
const Room = require('../models/roomModel')
const fetch = require('node-fetch')

/**
 * @method GET
 * @input access token in authorization request header
 * @return list of rooms | []
 * @roomInfo {room_id, name, speakers, audience, available}
 * */
module.exports.getRooms = async(request, response) => {
    let allRooms = await Room.find()
    let rooms = [];
    allRooms.forEach((room) => {
        rooms.push({
            room_id : room._id,
            room_name : room.name,
            audience: room.audience.length,
            speakers: room.speakers.length,
            is_available: room.available,
            members: [
                ...room.speakers,
                ...room.audience
            ].slice(0, 3)

        })
    })

    return response.status(200).json({count: rooms.length, rooms: rooms});
}

/**
 * @method POST
 * @input access token in authorization request header
 * @input room id (room_id) in request
 * @return room object (roomInfo)|null
 * @roomInfo {_id, name, created_by, created_at, available, adminsList, usersList}
 * */
module.exports.getRoomInfo = async(request, response) => {
    let room = await Room.findOne({_id: request.body.room_id})
    return response.status(200).json({room_info: room});
}

/**
 * @method POST
 * @input access token in authorization request header
 * @input room name (name) in request
 * @return room object(roomInfo)|message(failed to create)
 * @roomInfo {_id, name, created_by, created_at, available, adminsList, usersList}
 * */
module.exports.createRoom = async (request, response) => {

    let user = await getUserInfo(request)

     let roomDetails = {
        name: request.body.name,
        created_by: user._id,
        available: true,
        audience: [],
        speakers: [
        {
            is_moderator: true,
            is_speaker: true,
            user_name : user.name,
            user_id: user._id,
            user_image: user.imageUrl
        }
        ]
    }

        try {
            let room = await Room.create(roomDetails)
            return response.status(200).json({message: "Room Created Successfully", room: room})
        }catch (Error){
            return response.status(200).json({message: "Failed To Create Room", room: {}})
        }
}

/**
 * @method POST
 * @input access token in authorization in request header
 * @input room id (room_id) in request body
 * @return message refer user joined room or not
 * */
module.exports.joinRoom = async(request, response) => {
    try{
        let room = await Room.findOne({_id: request.body.room_id})
        let user = await getUserInfo(request)
        let is_in_room = await checkIfUserInRoom([room.audience, room.speakers], user._id)
        if (is_in_room === false){
            room.audience.push(
                {
                    is_moderator: false,
                    is_speaker: false,
                    user_name : user.name,
                    user_id: user._id,
                    user_image: user.imageUrl
                }
            )

            let result = await Room.updateOne({_id: room._id}, room)
            return response.status(200).json({joined: true, room: room, message: result.nModified >= 1 ? "Joined Room Successfully" : "Failed To Join Room"});
        }else{
            return response.status(200).json({joined: true, room: room, message: "You Already Joined Before"});
        }

    }catch (Error){
        return response.status(200).json({joined: false, room: {}, message: "Invalid Room Identifier"});
    }
}

/**
 * @method POST
 * @input access token in authorization in request header
 * @input room id (room_id) in request body
 * @return message refer user left room or not
 * */
module.exports.leaveRoom = async(request, response) => {
    try{
        let room = await Room.findOne({_id: request.body.room_id})
        let user = await getUserInfo(request)

        room.audience.forEach((member, index) => {
            if (user._id === member.user_id){
                room.audience.splice(index, 1)
            }
        })
        room.speakers.forEach((member, index) => {
            if (user._id === member.user_id){
                room.speakers.splice(index, 1)
            }
        })

        let result = await Room.updateOne({_id: room._id}, room)
        return response.status(200).json({left: true, room: room, message: result.nModified >= 1 ? "You Left The Room Successfully": "You Out The Room"});

    }catch (Error){
        return response.status(200).json({left: false, room: {}, message: "Invalid Room Identifier"});
    }
}

/**
 * @method POST
 * @input access token in authorization in request header
 * @input room id (room_id) in request body
 * @return message refer to room ended or not
 * */
module.exports.endRoom = async(request, response) => {
    let room = await Room.deleteOne({_id: request.body.room_id})
    return response.status(200).json({message: room.deletedCount === 1 ? "Room Closed" : "Try Again"});
}

/**
 * @input access token in authorization in request header
 * @return user information
 * */
async function getUserInfo(request){
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': request.headers.authorization
        }
    }

    let api = '/user'
    let authResponse = null

    if (configurations.devEnvironment){
        authResponse = await fetch( 'http://localhost:3001' + api, options).then(res => res.json())
    }else{
        authResponse = await fetch('https://yalla-dardasha-user.herokuapp.com' + api, options).then(res => res.json())
    }

    let storageUrl = "https://yalla-dardasha-user.herokuapp.com/";
    let imageUrl = "http://mufix.org/uploads/users/default-user.png"

    if (authResponse.user.avatar){
        imageUrl = storageUrl + authResponse.user.avatar
    }

    authResponse.user.imageUrl = imageUrl
    return authResponse.user
}

/**
 * @input list of all audience in rooms
 * @input user id of the user who need to join
 * @return true|false
 * */
async function checkIfUserInRoom(members, user_id){
    let state = false;

    await members[0].forEach((member) => {
        if (user_id === member.user_id){
            state = true
            return;
        }
    })


    await members[1].forEach((member) => {
        if (user_id === member.user_id){
            state = true
            return;
        }
    })


    console.log(state)
    return state
}


/**
 * be careful if all left the room to make it un available
 * be careful if admin left the room and no another admin/moderator
 * */
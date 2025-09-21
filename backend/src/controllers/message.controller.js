import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js"
import Message from "../models/Message.js"
import User from "../models/User.js"

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password")
    res.status(200).json(filteredUsers)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const getMessageByUserId = async (req, res) => {
  try {
    const myId = req.user._id
    const { id } = req.params
    const message = await Message.find({
      $or: [
        { senderId: myId, receiverId: id },
        { senderId: id, receiverId: myId },
      ],
    })

    res.status(200).json(message)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body
    const { id } = req.params
    const senderId = req.user._id

    if (!text && !req.file)
      return res.status(400).json({ message: "Please fill all the fields" })

    if (senderId.equals(id))
      return res
        .status(400)
        .json({ message: "You can't send a message to yourself" })
    const receiverExists = await User.exists({ _id: id })

    if (!receiverExists)
      return res.status(404).json({ message: "Receiver does not exist" })

    let imageUrl
    if (req.file) {
      // Upload buffer to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        stream.end(req.file.buffer)
      })
      imageUrl = result.secure_url
    }

    const newMessage = new Message({
      senderId,
      receiverId: id,
      text,
      image: imageUrl,
    })

    await newMessage.save()

    const receiverSocketId = getReceiverSocketId(id)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    res.status(201).json(newMessage)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id

    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    })

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ]

    const chatPartners = await User.find({
      _id: { $in: chatPartnerIds },
    }).select("-password")

    res.status(200).json(chatPartners)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong" })
  }
}

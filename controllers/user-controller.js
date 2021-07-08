const { User, Thought } = require('../models');

const userController = {
    getAllUsers(req, res) {
        User.find()
        .select('-__v')
        .then(dbUserData => {
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        })
    },
    getOneUser(req, res) {
        User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('friends')
        .populate('thoughts')
        .then(dbUserData => {
            if (!dbUserData){
                return res.status(404).json({message : 'No user with this ID!'})
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        })
    },
    createUser(req, res) {
        User.create(req.body)
        .then(dbUserData => {
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        })
    },
    updateUser(req, res) {
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$set: req.body},
            {
                runValidators: true,
                new: true
            })
            .then(dbUserData => {
                if (!dbUserData){
                    return res.status(404).json({message : 'No user with this ID!'})
                }
                res.json(dbUserData)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err)
            })
    },
    deleteUser(req, res) {
        User.findOneAndDelete({_id: req.params.userId})
        .then(dbUserData => {
            if (!dbUserData){
                return res.status(404).json({message : 'No user with this ID!'})
            }
            return Thought.deleteMany({_id: {$in: dbUserData.thoughts }})
        })
        .then(res.json({message: 'User and thoughts have been destroyed.'}))
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        })
    },
    addFriend(req, res) {
        User.findOneAndUpdate({_id: req.params.userid}, {$addToSet: { friends: req.params.friendId }}, { new: true })
        .then(dbUserData => {
            if (!dbUserData){
                return res.status(404).json({message : 'No user with this ID!'})
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        })
    },
    removeFriend(req, res) {
    User.findOneAndUpdate({_id: req.params.userid}, {$pull: { friends: req.params.friendId }}, { new: true }) 
    .then(dbUserData => {
        if (!dbUserData){
            return res.status(404).json({message : 'No user with this ID!'})
        }
        res.json(dbUserData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    })       
    }
};

module.exports = userController;
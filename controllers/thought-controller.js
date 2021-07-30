const { Thought, User } = require('../models');

const thoughtController = {
 getThoughts(req, res) {
     Thought.find({})
     .sort({ createdAt: -1 })
     .then(dbThoughtData => {
         res.json(dbThoughtData)
     }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
 },

 getOneThought(req, res) {
     Thought.findOne({
         _id: req.params.thoughtId
     }).then(dbThoughtData => {
         if(!dbThoughtData){
             res.status(404).json({message: "No thought with that ID!"})
             return
         }
       res.json(dbThoughtData)
    }).catch((err) => {
       console.log(err);
       res.status(500).json(err);
     });
 },
 createThought({params, body}, res) {
     Thought.create(body)
     .then(({_id}) => {
         return User.findOneAndUpdate(
             {_id: params.userId},
             { $push: {thoughts: _id } },
             {new: true}
         );
     }).then(dbUserData => {
         if(!dbUserData) {
             res.status(404).json({message: "the Thought was created, but there is no user with that ID!"})
         }
     }).catch((err)=>{
         console.log(err);
         res.status(500).json(err)
     })
 },
 updateThought(req, res) {
     Thought.findOneAndUpdate(
         { _id: req.params.thoughtId },
         { $set: req.body },
         {runValidators: true},
         {new: true}
     ).then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
 },
 removeThought(req, res) {
     Thought.findOneAndRemove({ _id: req.params.thoughtId })
     .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        return User.findOneAndUpdate(
            {thoughts: req.params.thoughtId },
            {$pull: {thoughts: req.params. thoughtId } },
            { new: true }
        ).then(dbUserData => {
            if(!dbUserData){
              return res.status(404).json({ message: "thought was deleted, but there was no user!" })
            }
            res.json({message: "The thought was successfully removed!"})
        })
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
 },
 addReaction(req, res) {
     Thought.findOneAndUpdate(
         { _id: req.params.thoughtId },
         {$addToSet: {reactions: req.body } },
         {runValidators: true},
         {new: true}
     ).then(dbThoughtData => {
         if(!dbThoughtData) {
            return res.status(404).json({message: "No thought with that ID!"}) 
         }
         res.json(dbThoughtData)
     }).catch(err =>{
         console.log(err)
         res.status(500).json(err)
     })
 },
 deleteReaction(req, res) {
     Thought.findOneAndUpdate(
         { _id: req.params.thoughtId },
         { $pull: {thoughts: req.params.reactionId } },
         {runValidators: true },
         {new: true}
     ).then(dbThoughtData => {
        if(!dbThoughtData) {
           return res.status(404).json({message: "No thought with that ID!"})    
        }
        res.json(dbThoughtData)
    }).catch(err =>{
        console.log(err)
        res.status(500).json(err)
    })
 }
};

module.exports = thoughtController;

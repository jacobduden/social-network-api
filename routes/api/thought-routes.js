const router = require('express').Router();
const {
  getThoughts,
  getOneThought,
  createThought,
  updateThought,
  removeThought,
  addReaction,
  deleteReaction
} = require('../../controllers/thought-controller');

router.route('/').get(getThoughts)

router.route('/:userId').post(createThought);

router
.route('/:thoughtId')
.get(getOneThought)
.put(updateThought)
.delete(removeThought)

router
.route('/:thoughtId/reactions')
.post(addReaction)

router
.route('/thoughtId/reactions/:reactionId')
.delete(deleteReaction);

module.exports = router;

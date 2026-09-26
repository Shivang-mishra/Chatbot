const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

router.post('/', conversationController.createConversation);
router.get('/', conversationController.getConversations);
router.get('/:id', conversationController.getConversationById);
router.post('/:id/messages', conversationController.addMessageToConversation);
router.delete('/:id', conversationController.deleteConversation);
router.put('/:id/rename', conversationController.renameConversation);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
    getContacts,
    createContacts,
    getContact,
    updateContact,
    deleteContact,
} = require('../controllers/contactController');
const validateToken = require('../middleware/validateTokenHandler');

//Middleware project routes
router.use(validateToken);

//Root path
router.route("/")
    .get(getContacts)
    .post(createContacts);

//Root parameter /:id
router.route("/:id")
    .get(getContact)
    .put(updateContact)
    .delete(deleteContact);


module.exports = router;

// //1-Get all contacts
// router.route('/').get((req, res) => {
//     res.status(200).json({msg: 'Get all contacts'})
// })
// //2-Create contact
// router.route('/').post((req, res) => {
//     res.status(200).json({msg: 'Create contact'})
// })
// //3-Get contact by ID
// router.route('/:id').get((req, res) => {
//     res.status(200).json({msg: 'Get contact by ID'})
// })
// //4-Update contact by ID
// router.route('/:id').put((req, res) => {
//     res.status(200).json({msg: 'Update contact by ID'})
// })
// //5-Delete contact by ID
// router.route('/:id').delete((req, res) => {
//     res.status(200).json({msg: 'Delete contact by ID'})
// })


const express = require('express')
const router = express.Router();
const Expense = require('../model/expenses.js');
const getCookieValues = (req) => {
    var cookie = req.headers.cookie;
    const cookieArr = cookie.split('; ');

    const cookieObj = Object.fromEntries(cookieArr.map(item => {
        const [key, value] = item.split('=');
        return [key, value];
    }));

    return cookieObj;
}

router.get('/getexpense/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Expense.find({ userId: id });  // Make sure to await the database query
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching document', errMessage: err });
    }
})

router.post('/createexpense', async (req, res) => {
    try {
        const { userId, userName } = getCookieValues(req);
        const cookieData = { userId: userId, userName: decodeURIComponent(userName) };

        const newData = { ...req.body, ...cookieData };
        const data = await Expense.create(newData);  // Make sure to await the database query
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: "Error creating the document", errMessage: err });
    }
})

router.put('/updateexpense/:userid', async (req, res) => {
    try {
        const userid = req.params.userid;
        const updateData = req.body;
        const data = await Expense.updateOne({ userId: userid }, updateData);  // Make sure to await the database query
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Unable to update the document', errMessage: err });
    }
})


module.exports = router;

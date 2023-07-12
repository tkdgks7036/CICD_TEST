const express = require('express');
const router = express.Router();

const { Users } = require('../models');
const { Posts } = require('../models');

// 회원가입 API
router.post('/', async (req, res) => {
    const { nickname, password, confirm } = req.body;

    try {
        // nickname 형식이 비정상적인 경우
        // 규칙 : 최소 3자 이상 + 대소문자(a~z, A~Z) / 숫자(0~9) 로 구성
        if (nickname.length < 3 || nickname.replace(/[a-zA-Z0-9]/g, "").length !== 0) {
            res.status(412).json({ 'errorMessage': '닉네임의 형식이 일치하지 않습니다.' });
            return;
        };

        // password 와 confirm 이 일치하지 않는 경우
        if (password !== confirm) {
            res.status(412).json({ 'errorMessage': '패스워드가 일치하지 않습니다.' });
            return;
        };

        // password 형식이 비정상적인 경우(1)
        // 규칙 : 최소 4자 이상
        if (password.length < 4) {
            res.status(412).json({ 'errorMessage': '패스워드 형식이 일치하지 않습니다.' });
            return;
        };

        // password 형식이 비정상적인 경우(2)
        // 규칙 : password 에 nickname 패턴이 포함되어 있는 경우
        if (password.includes(nickname)) {
            res.status(412).json({ 'errorMessage': '패스워드에 닉네임이 포함되어 있습니다.' });
            return;
        };

        // nickname 중복
        const ExistUser = await Users.findOne({ where: { nickname } });
        if (ExistUser) {
            res.status(412).json({ 'errorMessage': '중복된 닉네임입니다.' });
            return;
        };

        await Users.create({ nickname, password });
        res.status(201).json({ 'message': '회원 가입에 성공하였습니다.' });
    } catch (error) {
        res.status(400).json({ 'errorMessage': '요청한 데이터 형식이 올바르지 않습니다.' });
        console.error(error);
    };
});

module.exports = router;
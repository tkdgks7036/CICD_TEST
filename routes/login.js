const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const { Users } = require('../models');

// 로그인 API
router.post('/', async (req, res) => {
    const { nickname, password } = req.body;

    try {
        // 1. nickname 이 DB 에 등록되어 있는지?
        // 2. 등록되어 있는 nickname 이 가지고 있는 password 와 일치하는지?
        // 정확히 무엇이 틀렸는지 에러 메세지를 출력하는 것은 보안상 좋지 않다.
        const ExistUser = await Users.findOne({ where: { nickname: nickname } });
        if (!ExistUser || password !== ExistUser.password) {
            res.status(412).json({ 'errorMessage': '닉네임 또는 패스워드를 확인해주세요' });
            return;
        };

        const token = jwt.sign({ nickname: ExistUser.nickname }, process.env.PRIVATE_KEY);

        // 인증된 JWT token 을 cookie 로 할당 후 body 로 보낸다.
        res.cookie('Authorization', `Bearer ${token}`);
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ 'errorMessage': '로그인에 실패하였습니다.' });
        console.error(error);
    };
});

module.exports = router;
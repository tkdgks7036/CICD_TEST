const jwt = require('jsonwebtoken');
const { Users } = require('../models');

module.exports = async (req, res, next) => {
    const { Authorization } = req.cookies;

    // 위에서 가져온 cookie 값이 비어있다면 "" 로 변경하고
    // 값이 존재한다면 .split(' ') 의 규칙을 따른다.

    //! 주의할 점 : 자꾸 변수를 { } 로 담고있는 내 자신을 본다.
    //! .split 을 해야하기 때문에 나눈 값을 배열에 담을 것
    const [tokentype, token] = (Authorization ?? "").split(' ');

    // 1. token 의 유무
    // 2. tokentype 이 'Bearer' 인지 ?
    if (!token || tokentype !== 'Bearer') {
        res.status(403).json({ 'errorMessage': '로그인이 필요한 기능입니다.' });
        return;
    };

    try {
        // 1. token 만료 여부
        // 2. 전달받은 token 이 서버가 발급한 것이 맞는지 체크

        // token 에는 Header, Payload, signature 가 담겨져있다.
        // 더 나아가 signature 안에 있는 Private Key 를 통해 데이터 위조 여부를 판단한다.
        const { nickname } = jwt.verify(token, process.env.PRIVATE_KEY);
        const user = await Users.findOne({ where: { nickname: nickname } });

        res.locals.user = user;

        next();
    } catch (error) {
        res.status(403).json({ errorMessage: '로그인이 필요한 기능입니다.' });
        console.error(error);
        return;
    };
};
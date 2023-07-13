const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth-middleware.js');
const { Posts } = require('../models');
const { Op } = require('sequelize');

// 게시글 목록 조회 API
router.get('/', async (req, res) => {
    try {
        const posts = await Posts.findAll({
            attributes: ['postId', 'userId', 'nickname', 'title', 'createdAt', 'updatedAt'],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ 'posts': posts });
    } catch (error) {
        res.status(400).json({ 'errorMessage': '게시글 조회에 실패하였습니다.' });
        console.error(error);
    };
});

// 게시글 목록 상세 조회 API
router.get('/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Posts.findOne({
            where: { postId: postId },
            attributes: ['postId', 'userId', 'nickname', 'title', 'content', 'createdAt', 'updatedAt']
        });

        res.status(200).json({ 'post': post });
    } catch (error) {
        res.status(400).json({ 'errorMessage': '게시글 조회에 실패하였습니다.' });
        console.error(error);
    };
});

// 게시글 작성 API
router.post('/', authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    const { userId, nickname } = res.locals.user;

    try {
        if (!req.cookies) { // cookie 가 존재하지 않는 경우
            res.status(403).json({ 'errorMessage': '로그인이 필요한 기능입니다.' });
            return;
        };

        if (!req.body) { // body 가 존재하지 않는 경우
            res.status(412).json({ 'errorMessage': '데이터 형식이 올바르지 않습니다.' });
            return;
        };

        if (!title) { // title 이 비어있는 경우
            res.status(412).json({ 'errorMessage': '게시글 제목의 형식이 일치하지 않습니다.' });
            return;
        };

        if (!content) { // content 이 비어있는 경우
            res.status(412).json({ 'errorMessage': '게시글 내용의 형식이 일치하지 않습니다.' });
            return;
        };

        await Posts.create({ userId: userId, nickname: nickname, title, content });
        res.status(201).json({ 'message': '게시글 작성에 성공하였습니다.' });
    } catch (error) {
        res.status(400).json({ 'errorMessage': '게시글 작성에 실패하였습니다.' });
        console.error(error);
    };
});

// 게시글 수정 API
router.put('/:postId', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    const { title, content } = req.body;

    try {
        if (!req.cookies) { // cookie 가 존재하지 않는 경우
            res.status(403).json({ 'errorMessage': '로그인이 필요한 기능입니다.' });
            return;
        };

        if (!req.body) { // body 가 존재하지 않는 경우
            res.status(412).json({ 'errorMessage': '데이터 형식이 올바르지 않습니다.' });
            return;
        };

        if (!title) { // title 이 비어있는 경우
            res.status(412).json({ 'errorMessage': '게시글 제목의 형식이 일치하지 않습니다.' });
            return;
        };

        if (!content) { // content 이 비어있는 경우
            res.status(412).json({ 'errorMessage': '게시글 내용의 형식이 일치하지 않습니다.' });
            return;
        };

        // 수정이 필요한 게시글 ( = update_target ) 을 작성한 nickname 과
        // req.body 에서 입력한 nickname 이 일치하는지 확인 후 수정 권한 체크
        const update_target = await Posts.findOne({ where: { postId: postId } })
        if (userId !== update_target.userId) {
            res.status(403).json({ 'errorMessage': '게시글 수정의 권한이 존재하지 않습니다.' });
            return;
        };

        // 수정이 정상적으로 되었는지 확인
        // modifiedCount => 수정된 것이 있는지 체크 ( 수정o : 1, 수정x: 0 )
        //! 해당 조건은 수정할 때마다 updatedAt 은 계속 변경되기 때문에 완벽한 조건은 아니다.
        const update_done = await Posts.update(
            { title, content },
            { where: { [Op.and]: [{ postId: postId }, { userId: userId }] } }
        );

        if (update_done != 1) {
            res.status(401).json({ errorMessage: '게시글이 정상적으로 수정되지 않았습니다.' });
            return;
        };

        res.status(200).json({ message: '게시글을 수정하였습니다.' });
    } catch (error) {
        res.status(400).json({ errorMessage: '게시글 작성에 실패하였습니다.' });
        console.error(error);
    };
});

// 게시글 삭제 API
router.delete('/:postId', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;

    try {
        if (!req.cookies) { // cookie 가 존재하지 않는 경우
            res.status(403).json({ 'errorMessage': '로그인이 필요한 기능입니다.' });
            return;
        };

        // 삭제가 필요한 게시글 ( = delete_target ) 을 작성한 nickname 과
        // req.body 에서 입력한 nickname 이 일치하는지 확인 후 수정 권한 체크
        const delete_target = await Posts.findOne({ where: { postId: postId } })
        if (userId !== delete_target.userId) {
            res.status(403).json({ 'errorMessage': '게시글 삭제의 권한이 존재하지 않습니다.' });
            return;
        };

        // 삭제된 게시글이 있는지 체크해서 삭제가 정상적으로 처리되었는지 확인
        // deletedCount => 삭제된 것이 있는지 체크 ( 삭제o : 1, 삭제x: 0 )
        const delete_done = await Posts.destroy(
            { where: { [Op.and]: [{ postId: postId }, { userId: userId }] } }
        );

        if (delete_done !== 1) {
            res.status(401).json({ errorMessage: '게시글이 정상적으로 삭제되지 않았습니다.' });
            return;
        };

        res.status(200).json({ message: '게시글을 삭제하였습니다.' });
    } catch (error) {
        res.status(400).json({ errorMessage: '게시글 삭제에 실패하였습니다.' });
        console.error(error);
    };
});

module.exports = router;
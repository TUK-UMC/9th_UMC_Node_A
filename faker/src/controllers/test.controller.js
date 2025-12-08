// src/controllers/test.controller.js

import { generateTokens } from "../auth/auth.service.js";

export const handleTest = (req, res) => {
    res.send('Hello World!');
};

export const handleSetCookie = (req, res) => {
    res.cookie('myCookie', 'hello', { maxAge: 60000 });
    res.send('쿠키가 생성되었습니다!');
};

export const handleGetCookie = (req, res) => {
    const myCookie = req.cookies.myCookie; 
    res.send(myCookie ? `당신의 쿠키: ${myCookie}` : '쿠키가 없습니다.');
};

export const handleGenerateTestToken = (req, res) => {
    // 1. URL 파라미터에서 userId를 가져와 숫자로 변환
    const userId = parseInt(req.params.userId, 10);

    // 2. 가져온 userId로 토큰 생성
    const { accessToken } = generateTokens({ id: userId, email: "test@example.com" });

    res.success({ 
        message: `${userId}번 유저의 토큰 발급 성공`, 
        token: accessToken 
    });
};
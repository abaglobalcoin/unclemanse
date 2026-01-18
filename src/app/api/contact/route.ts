import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'data', 'settings.json');

export async function POST(request: Request) {
  try {
    const { name, email, phone, company, message, adType } = await request.json();

    // 필수 필드 검증
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: '이름, 이메일, 문의내용은 필수입니다.' },
        { status: 400 }
      );
    }

    // 설정 파일에서 SMTP 정보 읽기
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    const { smtp, contactEmail, companyInfo } = settings;

    // SMTP 설정 확인
    if (!smtp.host || !smtp.user || !smtp.password) {
      // SMTP 설정이 없으면 콘솔에 로그만 남김 (개발용)
      console.log('=== 새 문의 접수 ===');
      console.log('이름:', name);
      console.log('이메일:', email);
      console.log('전화번호:', phone);
      console.log('회사명:', company);
      console.log('광고유형:', adType);
      console.log('문의내용:', message);
      console.log('====================');

      return NextResponse.json({
        success: true,
        message: '문의가 접수되었습니다. (SMTP 미설정으로 이메일 발송 생략)',
      });
    }

    // SMTP 트랜스포터 생성
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port || 587,
      secure: smtp.port === 465,
      auth: {
        user: smtp.user,
        pass: smtp.password,
      },
    });

    // 이메일 내용 구성
    const htmlContent = `
      <div style="font-family: 'Malgun Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #22c55e; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">
          새로운 문의가 접수되었습니다
        </h2>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 100px;">이름</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">이메일</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">전화번호</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${phone}</td>
          </tr>
          ` : ''}
          ${company ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">회사명</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${company}</td>
          </tr>
          ` : ''}
          ${adType ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">광고유형</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${adType}</td>
          </tr>
          ` : ''}
        </table>

        <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
          <h3 style="margin: 0 0 10px 0; color: #374151;">문의내용</h3>
          <p style="margin: 0; white-space: pre-wrap; color: #4b5563;">${message}</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #9ca3af; font-size: 12px;">
          <p>이 메일은 ${companyInfo?.name || '엉클만세'} 웹사이트에서 자동 발송되었습니다.</p>
        </div>
      </div>
    `;

    // 이메일 발송
    await transporter.sendMail({
      from: `"${companyInfo?.name || '엉클만세'} 문의" <${smtp.user}>`,
      to: contactEmail || companyInfo?.email || 'unclemanse@naver.com',
      replyTo: email,
      subject: `[문의] ${name}님의 새로운 문의가 접수되었습니다`,
      html: htmlContent,
    });

    // 고객에게 자동 응답 메일 발송
    const autoReplyHtml = `
      <div style="font-family: 'Malgun Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #22c55e;">문의가 접수되었습니다</h2>

        <p style="color: #374151;">안녕하세요, ${name}님!</p>

        <p style="color: #4b5563;">
          ${companyInfo?.name || '엉클만세'}에 문의해 주셔서 감사합니다.<br>
          빠른 시일 내에 담당자가 연락드리겠습니다.
        </p>

        <div style="margin: 30px 0; padding: 20px; background-color: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
          <h3 style="margin: 0 0 10px 0; color: #15803d;">문의하신 내용</h3>
          <p style="margin: 0; white-space: pre-wrap; color: #4b5563;">${message}</p>
        </div>

        <div style="margin-top: 30px; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
          <h4 style="margin: 0 0 10px 0; color: #374151;">연락처</h4>
          <p style="margin: 5px 0; color: #4b5563;">전화: ${companyInfo?.phone || '031-945-1217'}</p>
          <p style="margin: 5px 0; color: #4b5563;">이메일: ${companyInfo?.email || 'unclemanse@naver.com'}</p>
          <p style="margin: 5px 0; color: #4b5563;">주소: ${companyInfo?.address || '경기도 파주시 교하로 421 (동패동)'}</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #9ca3af; font-size: 12px;">
          <p>본 메일은 자동 발송되었으며, 회신이 불가합니다.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"${companyInfo?.name || '엉클만세'}" <${smtp.user}>`,
      to: email,
      subject: `[${companyInfo?.name || '엉클만세'}] 문의가 접수되었습니다`,
      html: autoReplyHtml,
    });

    return NextResponse.json({
      success: true,
      message: '문의가 성공적으로 접수되었습니다.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: '문의 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

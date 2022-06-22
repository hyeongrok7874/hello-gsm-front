import type { GetServerSideProps, NextPage } from 'next';
import { SchoolPage, SEOHelmet } from 'components';
import auth from 'Api/auth';
import useStore from 'Stores/StoreContainer';
import { useEffect } from 'react';
import { CheckType } from 'type/check';
import { HeaderType } from 'type/header';

const School: NextPage<CheckType> = ({ check }) => {
  const seoTitle = '학교 소개';
  const desc = '광주소프트웨어마이스터고등학교를 소개합니다.';
  const { setLogged } = useStore();
  useEffect(() => {
    setLogged(check);
  }, []);
  return (
    <>
      <SEOHelmet seoTitle={seoTitle} desc={desc} />
      <SchoolPage />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const accessToken = `accessToken=${ctx.req.cookies.accessToken}`;
  const refreshToken = `refreshToken=${ctx.req.cookies.refreshToken}`;

  try {
    await auth.check(accessToken);
    return {
      props: {
        check: true,
      },
    };
  } catch (err) {
    //accessToken 만료시 refresh 요청
    if (ctx.req.cookies.refreshToken) {
      // 요청 헤더를 가저온다
      const { headers }: HeaderType = await auth.refresh(refreshToken);
      // 브라우저에 쿠키들을 저장한다
      ctx.res.setHeader('set-cookie', headers['set-cookie']);
      return {
        props: {
          check: true,
        },
      };
    } else {
      return {
        props: {
          check: false,
        },
      };
    }
  }
};

export default School;

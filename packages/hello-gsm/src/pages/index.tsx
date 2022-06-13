import type { GetServerSideProps, NextPage } from 'next';
import { MainPage, SEOHelmet } from 'components';
import user from 'Api/user';
import { StatusType } from 'type/user';
import { HeaderType } from 'type/header';
import auth from 'Api/auth';

const Home: NextPage<StatusType> = ({ data }) => {
  const seoTitle = '홈';
  const desc = '입학 일정을 설명합니다.';
  return (
    <>
      <SEOHelmet seoTitle={seoTitle} desc={desc} />
      <MainPage data={data} />
    </>
  );
};

const getStatus = async (accessToken: string) => {
  try {
    const { data }: StatusType = await user.status(accessToken);
    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
    };
  }
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const accessToken = `accessToken=${ctx.req.cookies.accessToken}`;
  const refreshToken = `refreshToken=${ctx.req.cookies.refreshToken}`;

  if (ctx.req.cookies.refreshToken) {
    if (ctx.req.cookies.accessToken) {
      return getStatus(accessToken);
    } else {
      try {
        const { headers }: HeaderType = await auth.refresh(refreshToken);
        const accessToken = headers['set-cookie'][0].split(';')[0];
        ctx.res.setHeader('set-cookie', headers['set-cookie']);
        return getStatus(accessToken);
      } catch (error) {
        console.log(error);
        return {
          props: {},
        };
      }
    }
  } else {
    return {
      props: {},
    };
  }
};

export default Home;

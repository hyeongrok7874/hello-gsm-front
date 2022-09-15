import type { GetServerSideProps, NextPage } from 'next';
import { SEOHelmet } from 'components';
import { TicketPage } from 'PageContainer';
import application from 'Api/application';
import { TicketDataType } from 'Types/ticket';
import auth from 'Api/auth';
import { HeaderType } from 'Types/header';

const Ticket: NextPage<TicketDataType> = ({ data }) => {
  const seoTitle = '수험표 출력';
  const desc = '지원자들의 수험표를 출력하는 페이지입니다.';
  return (
    <>
      <SEOHelmet seoTitle={seoTitle} desc={desc} />
      <TicketPage data={data} />
    </>
  );
};

const getTicket = async (adminAaccessToken: string) => {
  try {
    const { data }: TicketDataType = await application.ticket(
      adminAaccessToken,
    );
    return {
      props: {
        data,
      },
    };
  } catch (e) {
    return {
      props: {},
      redirect: {
        destination: '/signin',
      },
    };
  }
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const refreshToken = `adminRefreshToken=${ctx.req.cookies.adminRefreshToken}`;
  const accessToken = `adminAccessToken=${ctx.req.cookies.adminAccessToken}`;

  if (ctx.req.cookies.adminRefreshToken) {
    if (ctx.req.cookies.adminAccessToken) {
      return getTicket(accessToken);
    } else {
      const { headers }: HeaderType = await auth.refresh(refreshToken);
      // headers의 set-cookie의 첫번째 요소 (accessToken)을 가져와 저장한다.
      const accessToken = headers['set-cookie'][0].split(';')[0];
      // 브라우저에 쿠키들을 저장한다
      ctx.res.setHeader('set-cookie', headers['set-cookie']);
      // headers에서 가져온 accessToken을 담아 요청을 보낸다
      return getTicket(accessToken);
    }
  } else {
    return {
      props: {},
      redirect: {
        destination: '/signin',
      },
    };
  }
};

const dummyData = [
  {
    name: '유시온',
    birth: '2000-01-01T00:00:00.000Z',
    application: {
      schoolName: '풍암중학교',
      screening: '일반전형',
      registrationNumber: 1001,
    },
    application_image: {
      idPhotoUrl:
        'https://hello-gsm-backend.s3.ap-northeast-2.amazonaws.com/176d2840-fb83-11ec-8bd2-4758bb13042e',
    },
  },
  {
    name: '유시온',
    birth: '2000-01-01T00:00:00.000Z',
    application: {
      schoolName: '풍암중학교',
      screening: '일반전형',
      registrationNumber: 1001,
    },
    application_image: {
      idPhotoUrl:
        'data:image/jpeg;base64,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',
    },
  },
  {
    name: '유시온',
    birth: '2000-01-01T00:00:00.000Z',
    application: {
      schoolName: undefined,
      screening: '일반전형',
      registrationNumber: 1001,
    },
    application_image: {
      idPhotoUrl:
        'data:image/jpeg;base64,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',
    },
  },
  {
    name: '유시온',
    birth: '2000-01-01T00:00:00.000Z',
    application: {
      schoolName: '풍암중학교',
      screening: '일반전형',
      registrationNumber: 1001,
    },
    application_image: {
      idPhotoUrl:
        'data:image/jpeg;base64,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',
    },
  },
  {
    name: '유시온',
    birth: '2000-01-01T00:00:00.000Z',
    application: {
      schoolName: '풍암중학교',
      screening: '일반전형',
      registrationNumber: 1001,
    },
    application_image: {
      idPhotoUrl:
        'data:image/jpeg;base64,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',
    },
  },
  {
    name: '유시온',
    birth: '2000-01-01T00:00:00.000Z',
    application: {
      schoolName: '풍암중학교',
      screening: '일반전형',
      registrationNumber: 1001,
    },
    application_image: {
      idPhotoUrl:
        'data:image/jpeg;base64,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',
    },
  },
  {
    name: '유시온',
    birth: '2000-01-01T00:00:00.000Z',
    application: {
      schoolName: '풍암중학교',
      screening: '일반전형',
      registrationNumber: 1001,
    },
    application_image: {
      idPhotoUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOyepi7WKc_UULbDgxywxbG-x8-flzv9rmIg&usqp=CAU',
    },
  },
];
export default Ticket;

import type { NextPage } from 'next';
import * as S from './style';
import { useForm } from 'react-hook-form';
import auth from 'Api/auth';
import { LoginType } from 'Types/user';
import { css } from '@emotion/react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const SignInPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>();

  const { push } = useRouter();

  // 로그인 시도
  const onValid = async ({ id, password }: LoginType) => {
    try {
      await auth.signin({ id, password });
      toast.success('로그인을 성공하였습니다.');
      push('/');
    } catch (err: any) {
      console.error(err);
      toast.error('아이디 혹은 비밀번호가 잘못되었습니다.');
    }
  };

  const SelectError = () =>
    css({
      animation: `${S.shake} 0.3s`,
    });

  return (
    <S.SignInPage>
      <S.BigBall />
      <S.SmallBall />
      <S.SignInForm onSubmit={handleSubmit(onValid)}>
        <S.Title>로그인</S.Title>
        <S.Input
          placeholder="아이디를 입력해주세요."
          type="text"
          {...register('id', {
            required: '* 아이디를 입력해주세요.',
            // minLength: 6,
            // maxLength: 12,
          })}
        />
        <S.Error css={errors.id && SelectError}>{errors.id?.message}</S.Error>
        <S.Input
          placeholder="비밀번호를 입력해주세요."
          type="password"
          autoComplete="on"
          {...register('password', {
            required: '* 비밀번호를 입력해주세요.',
            // minLength: 8,
            // maxLength: 16,
          })}
        />
        <S.Error css={errors.password && SelectError}>
          {errors.password?.message}
        </S.Error>
        <S.Submit>로그인</S.Submit>
      </S.SignInForm>
    </S.SignInPage>
  );
};

export default SignInPage;

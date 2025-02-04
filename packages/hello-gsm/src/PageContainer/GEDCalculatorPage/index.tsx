import application from 'Api/application';
import auth from 'Api/auth';
import { Header, GEDScoreResultModal } from 'components';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useStore from 'Stores/StoreContainer';
import { GEDLocalScoreType, GEDScoreType } from 'type/score';
import { GEDCalculate, Rounds } from 'Utils/Calculate';
import * as S from './style';

interface ScoreType {
  curriculumScoreSubtotal: number; // 전과목 득점
  nonCurriculumScoreSubtotal: number; // 전과목 만점
}

interface UserIdxType {
  userIdx: number;
  isSubmissionProp: boolean;
}

const GEDCalculatorPage: NextPage<UserIdxType> = ({
  userIdx,
  isSubmissionProp,
}) => {
  const { register, handleSubmit, setValue } = useForm<ScoreType>();

  const { showScoreResult, setShowScoreResult } = useStore();
  const [result, setResult] = useState<number[]>(); //결과 화면 컴포넌트에 보일 점수
  // 이전에 제출한 경험 여부 판단
  const [isSubmission, setIsSubmission] = useState<boolean>(isSubmissionProp);

  useEffect(() => {
    const localstorageData = window.localStorage.getItem(`${userIdx}`);
    const scoreData: GEDLocalScoreType | null = localstorageData
      ? JSON.parse(localstorageData)
      : null;
    if (scoreData) {
      setValue('curriculumScoreSubtotal', scoreData.curriculumScoreSubtotal);
      setValue(
        'nonCurriculumScoreSubtotal',
        scoreData.nonCurriculumScoreSubtotal,
      );
    }
  }, []);

  const TrySubmission = async ({
    curriculumScoreSubtotal,
    nonCurriculumScoreSubtotal,
    rankPercentage,
    scoreTotal,
  }: GEDScoreType) => {
    isSubmission
      ? await application.patchGedSubmission({
          curriculumScoreSubtotal,
          nonCurriculumScoreSubtotal,
          rankPercentage,
          scoreTotal,
        })
      : await application.postGedSubmission({
          curriculumScoreSubtotal,
          nonCurriculumScoreSubtotal,
          rankPercentage,
          scoreTotal,
        });
  };

  const onValid = async ({
    curriculumScoreSubtotal,
    nonCurriculumScoreSubtotal,
  }: ScoreType) => {
    const rankPercentage = GEDCalculate(
      curriculumScoreSubtotal,
      nonCurriculumScoreSubtotal,
    );

    const scoreTotal = Rounds((300 - (300 * rankPercentage) / 100) * 0.87, 3);

    try {
      await TrySubmission({
        curriculumScoreSubtotal,
        nonCurriculumScoreSubtotal,
        rankPercentage,
        scoreTotal,
      });

      const scoreObject = {
        curriculumScoreSubtotal: curriculumScoreSubtotal,
        nonCurriculumScoreSubtotal: nonCurriculumScoreSubtotal,
      };

      localStorage.setItem(`${userIdx}`, JSON.stringify(scoreObject));

      setResult([rankPercentage, scoreTotal]);
      setShowScoreResult();
      setIsSubmission(true);
      toast.success('성적입력이 완료되었습니다.');
    } catch (err: any) {
      // accessToken 없을 시에 accessToken 발급 후 TrySubmission 요청
      if (err.response.status === 401) {
        try {
          // accessToken 발급
          await auth.refresh();
          await onValid({
            curriculumScoreSubtotal,
            nonCurriculumScoreSubtotal,
          }); // 다시 요청
        } catch (err) {
          console.log(err);
          toast.error('문제가 발생하였습니다. 다시 시도해주세요.');
        }
      } else {
        console.log(err);
        toast.error('문제가 발생하였습니다. 다시 시도해주세요.');
      }
    }
  };

  const inValid = (Errors: FieldErrors) => {
    console.log(Errors);
    toast.error('문제가 발생하였습니다. 다시 시도해주세요.');
  };

  return (
    <>
      <Header />
      {showScoreResult && <GEDScoreResultModal result={result} />}
      <S.GEDPage>
        <S.Title>성적입력(검정고시)</S.Title>
        <S.CalculateSection onSubmit={handleSubmit(onValid, inValid)}>
          <div>
            <S.Row>
              <S.ScoreSubject>전과목 득점 합계</S.ScoreSubject>
              <S.PerfectScoreSubject>전과목 만점 합계</S.PerfectScoreSubject>
            </S.Row>
            <S.Row>
              <S.ScoreInput
                {...register('curriculumScoreSubtotal', {
                  valueAsNumber: true,
                  required: true,
                  validate: {
                    nagativeNumber: value => !(value < 0),
                  },
                })}
                type="number"
              />
              <S.ScoreInput
                {...register('nonCurriculumScoreSubtotal', {
                  valueAsNumber: true,
                  required: true,
                  validate: {
                    nagativeNumber: value => !(value < 0),
                  },
                })}
                type="number"
              />
            </S.Row>
          </div>
          <S.Submit>저장</S.Submit>
        </S.CalculateSection>
      </S.GEDPage>
    </>
  );
};

export default GEDCalculatorPage;

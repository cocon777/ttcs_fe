import type { NoiDungDe } from "../utils/formatExam";

function getExamStats(examJSON: NoiDungDe) {
  const cauHois = Object.values(examJSON.cauHois);

  const tongSoCau = cauHois.length;

  const cacCauChuaDapAn = cauHois
    .filter(
      (cauHoi) => !Object.values(cauHoi.luaChons).some((lc) => lc.laDapAn),
    )
    .map((cauHoi) => `Câu ${cauHoi.thuTu}`);

  return {
    totalMultiChoice: tongSoCau,
    totalUnanswered: cacCauChuaDapAn.length,
    unansweredList: cacCauChuaDapAn,
  };
}

export default getExamStats;

// Câu 1.[NB] aaa
// A. aaa
// B. bbb
// C. ccc
// D. ddd
// Câu 2.[TH] bbb
// A. aaa
// B. bbb
// C. ccc
// D. ddd
// ---HẾT---
// BẢNG ĐÁP ÁN
// 1A 2B
// --> convert to JSON
// {
//   "cauHois": {
//     "Câu 1": {
//       "thuTu": 1,
//       "mucDo": "NB",
//       "noiDung": "aaa",
//       "dong": 1,
//       "luaChons": {
//         "A": { "kyHieu": "A", "noiDung": "aaa", "laDapAn": true, "dong": 2 },
//         "B": { "kyHieu": "B", "noiDung": "bbb", "laDapAn": false, "dong": 3 },
//         "C": { "kyHieu": "C", "noiDung": "ccc", "laDapAn": false, "dong": 4 },
//         "D": { "kyHieu": "D", "noiDung": "ddd", "laDapAn": false, "dong": 5 }
//       }
//     },
//     "Câu 2": {
//       "thuTu": 2,
//       "mucDo": "TH",
//       "noiDung": "bbb",
//       "dong": 6,
//       "luaChons": {
//         "A": { "kyHieu": "A", "noiDung": "aaa", "laDapAn": false, "dong": 7 },
//         "B": { "kyHieu": "B", "noiDung": "bbb", "laDapAn": true, "dong": 8 },
//         "C": { "kyHieu": "C", "noiDung": "ccc", "laDapAn": false, "dong": 9 },
//         "D": { "kyHieu": "D", "noiDung": "ddd", "laDapAn": false, "dong": 10 }
//       }
//     }
//   }
// }

export type MucDo = "NB" | "TH" | "VD" | "VDC";

export interface LuaChon {
  kyHieu: string;
  noiDung: string;
  laDapAn: boolean;
  dong: number;
}

export interface CauHoi {
  thuTu: number;
  noiDung: string;
  mucDo: MucDo;
  diem: number;
  luaChons: Record<string, LuaChon>;
  dong: number;
}

export interface NoiDungDe {
  cauHois: Record<string, CauHoi>;
}

const parseBangDapAn = (vanBan: string): Record<string, string> => {
  const bangDapAn: Record<string, string> = {};
  for (const match of vanBan.matchAll(/(\d+)([A-Z])/g)) {
    bangDapAn[match[1]] = match[2];
  }
  return bangDapAn;
};

// const parseLuaChons = (
//   noiDungCau: string,
//   bangDapAn: Record<string, string>,
//   thuTu: number,
//   cacDong: string[],
// ): Record<string, LuaChon> => {
//   const luaChons: Record<string, LuaChon> = {};

//   for (const match of noiDungCau.matchAll(/^([A-G])\.\s+(.+)/gm)) {
//     const kyHieu = match[1];
//     luaChons[kyHieu] = {
//       kyHieu,
//       noiDung: match[2].trim(),
//       laDapAn: bangDapAn[String(thuTu)] === kyHieu,
//       dong: cacDong.findIndex((dong) => dong.includes(`${kyHieu}.`)) + 1,
//     };
//   }

//   return luaChons;
// };

const parseLuaChons = (
  noiDungCau: string,
  bangDapAn: Record<string, string>,
  thuTu: number,
  cacDong: string[],
): Record<string, LuaChon> => {
  const luaChons: Record<string, LuaChon> = {};

  // Tách vị trí bắt đầu của từng lựa chọn
  const starts: { index: number; kyHieu: string }[] = [];
  for (const m of noiDungCau.matchAll(/^([A-G])\.\s/gm)) {
    starts.push({ index: m.index!, kyHieu: m[1] });
  }

  starts.forEach(({ index, kyHieu }, i) => {
    const start = index + `${kyHieu}. `.length; // bỏ "A. "
    const end = starts[i + 1]?.index ?? noiDungCau.length;
    const noiDung = noiDungCau.slice(start, end).trim();

    luaChons[kyHieu] = {
      kyHieu,
      noiDung,
      laDapAn: bangDapAn[String(thuTu)] === kyHieu,
      dong: cacDong.findIndex((dong) => dong.includes(`${kyHieu}.`)) + 1,
    };
  });

  return luaChons;
};

const convertToJSON = (vanBan: string): NoiDungDe => {
  const cacDong = vanBan.split("\n");

  // 1. Tách bảng đáp án
  const phanDapAn = vanBan.match(/BẢNG ĐÁP ÁN\s*([\s\S]*?)$/);
  const bangDapAn = phanDapAn ? parseBangDapAn(phanDapAn[1]) : {};

  // 2. Bỏ phần "---HẾT---" trở đi
  const vanBanChinh = vanBan.split(/---HẾT---/)[0];

  // 3. Tách từng câu hỏi
  const cauHoiRegex = /Câu (\d+)\.\[(NB|TH|VD|VDC)\]/g;
  const cacCauHoiMatch = Array.from(vanBanChinh.matchAll(cauHoiRegex));

  const cauHois: Record<string, CauHoi> = {};

  cacCauHoiMatch.forEach((match, i) => {
    const thuTu = parseInt(match[1]);
    const mucDo = match[2] as MucDo;
    const cauHoiKey = match[0];

    const viTriBatDau = match.index! + match[0].length;
    const viTriKetThuc = cacCauHoiMatch[i + 1]?.index ?? vanBanChinh.length;
    const noiDungBlock = vanBanChinh.slice(viTriBatDau, viTriKetThuc).trim();

    // 4. Tách nội dung câu hỏi (dòng đầu tiên)
    // const viTriXuongDong = noiDungBlock.indexOf("\n");
    // const noiDung =
    //   viTriXuongDong === -1
    //     ? noiDungBlock
    //     : noiDungBlock.slice(0, viTriXuongDong).trim();

    // 4. Tách nội dung câu hỏi (đến trước lựa chọn đầu tiên)
    const viTriLuaChonDau = noiDungBlock.search(/^[A-G]\.\s/m);
    const noiDung =
      viTriLuaChonDau === -1
        ? noiDungBlock.trim()
        : noiDungBlock.slice(0, viTriLuaChonDau).trim();

    // 5. Tìm số dòng của câu hỏi
    const dongCauHoi =
      cacDong.findIndex((dong) => dong.includes(cauHoiKey)) + 1;

    // 6. Tách lựa chọn
    const luaChons = parseLuaChons(noiDungBlock, bangDapAn, thuTu, cacDong);

    cauHois[`Câu ${thuTu}`] = {
      thuTu,
      mucDo,
      noiDung,
      luaChons,
      dong: dongCauHoi,
      diem: 0, // tính tự động bên dưới
    };
  });

  // Tự chia đều trên thang 10 sau khi có đủ số câu
  const soCau = Object.keys(cauHois).length;
  const diemMoiCau = soCau > 0 ? 10 / soCau : 0;
  Object.keys(cauHois).forEach((key) => {
    cauHois[key].diem = diemMoiCau;
  });

  return { cauHois };
};;

export default convertToJSON;

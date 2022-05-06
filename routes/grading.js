import express from "express";
import { code1, testCase1 } from "../dummyData/mission1.js";
import { code2, testCase2 } from "../dummyData/mission2.js";
import { code3, testCase3 } from "../dummyData/mission3.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { mission } = req.body;

  try {
    // db 연결되면 수정될 부분, code,testCase가 req로 들어올 예정
    let code;
    let testCase;
    if (mission === "mission1") {
      code = code1;
      testCase = testCase1;
    } else if (mission === "mission2") {
      code = code2;
      testCase = testCase2;
    } else {
      code = code3;
      testCase = testCase3;
    }

    let result = await getSolution(mission, code, testCase);

    if (result === 0) {
      res.send({ message: "complete" });
    } else {
      res.send({ message: "fail", failCount: result });
    }
  } catch (err) {
    console.log(err);
    res.send("error");
  }
});

const getSolution = async (mission, code, testCase) => {
  const fs = await import("fs");
  const timeStamp = +new Date();
  const fileName = `${timeStamp}.js`;
  fs.writeFileSync(fileName, code);
  let getJsFile = await import(`../${fileName}`);

  let falseCount = 0;
  for (let test of testCase) {
    // 결과가 배열, 객체이거나 1과 '1'과 같은 .. 그런 비교를 위해 JSON.stringify 사용
    if (
      JSON.stringify(getJsFile.solution(...test.input)) !==
      JSON.stringify(test.output)
    ) {
      falseCount += 1;
    }
  }
  fs.unlinkSync(fileName);
  getJsFile = null;
  return falseCount;
};

export default router;

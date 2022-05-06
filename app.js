import express from "express";
import cors from "cors";
import gradingRouter from "./routes/grading.js";

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

app.use("/grading", gradingRouter);
app.listen(port, () => {
  console.log("채점 서버 연결 완료");
});

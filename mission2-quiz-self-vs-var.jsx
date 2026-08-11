import { useState } from "react";

const C = {
  pageBg: "#eceef5",
  card: "#ffffff",
  ink: "#1f2430",
  sub: "#5b6472",
  accent: "#4f46e5",
  accentDark: "#4338ca",
  codeBg: "#1b1e2b",
  codeInk: "#e6e9f0",
  codeComment: "#6b7488",
  codeString: "#9ece6a",
  ok: "#16a34a",
  okBg: "rgba(22,163,74,0.16)",
  bad: "#dc2626",
  badBg: "rgba(220,38,38,0.16)",
  blankBorder: "#5b6479",
  blankBg: "rgba(148,163,184,0.16)",
  amber: "#b45309",
  amberBg: "#fef3c7",
  okBanner: "#166534",
  okBannerBg: "#dcfce7",
};

const BLANKS = [
  {
    id: "b1",
    answer: "quizzes",
    where: "self.quizzes = ____",
    explain:
      "오른쪽 quizzes는 __init__(self, quizzes)로 밖에서 받은 값이에요. 그냥 변수(매개변수)죠. 왼쪽 self.quizzes는 그 값을 객체에 저장하는 자리입니다. 오른쪽에도 self.quizzes를 쓰면 아직 만들어지지도 않은 값을 참조하게 돼서 에러가 나요. '받은 재료(quizzes)를 객체 주머니(self.quizzes)에 담는다'로 기억하면 쉬워요.",
  },
  {
    id: "b2",
    answer: "self.quizzes",
    where: "order = ____[:]",
    explain:
      "run() 안에는 quizzes라는 지역 변수가 없어요. 문제 목록은 객체에 저장돼 있으니 self.quizzes로 꺼내야 합니다. 그냥 quizzes라고 쓰면 NameError가 나요. 뒤의 [:]는 원본을 건드리지 않으려고 복사본을 뜨는 부분입니다.",
  },
  {
    id: "b3",
    answer: "order",
    where: "random.shuffle(____)",
    explain:
      "섞을 대상은 방금 만든 복사본 order예요. 여기에 self.quizzes를 넣으면 원본이 통째로 섞여버려서 복사한 의미가 사라집니다. shuffle은 받은 리스트를 그 자리에서 직접 섞는(in-place) 함수라, 더더욱 원본을 넣으면 안 돼요.",
  },
  {
    id: "b4",
    answer: "self.score",
    where: "____ += 1",
    explain:
      "점수는 문제를 푸는 내내 계속 쌓여야 하는 값이에요. 즉 객체가 들고 다니는 상태 → self.score. 그냥 score라고 쓰면 그런 지역 변수가 없어서 NameError가 납니다.",
  },
];

const normalize = (s) => (s || "").replace(/\s+/g, "").toLowerCase();

const lineStyle = {
  whiteSpace: "pre",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  fontSize: 13,
  lineHeight: "26px",
  color: C.codeInk,
};
const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const cmt = (t) => <span style={{ color: C.codeComment, fontStyle: "italic" }}>{t}</span>;
const str = (t) => <span style={{ color: C.codeString }}>{t}</span>;

function Blank({ b, value, onChange, graded }) {
  let border = C.blankBorder;
  let bg = C.blankBg;
  if (graded) {
    const ok = normalize(value) === normalize(b.answer);
    border = ok ? C.ok : C.bad;
    bg = ok ? C.okBg : C.badBg;
  }
  return (
    <input
      className="blank"
      value={value}
      onChange={(e) => onChange(b.id, e.target.value)}
      autoCapitalize="none"
      autoCorrect="off"
      autoComplete="off"
      spellCheck={false}
      placeholder="____"
      aria-label={"빈칸 " + b.id}
      style={{
        width: "13ch",
        fontFamily: "inherit",
        fontSize: "inherit",
        color: C.codeInk,
        background: bg,
        border: "1.5px solid " + border,
        borderRadius: 6,
        padding: "0 6px",
        margin: "0 2px",
        textAlign: "center",
      }}
    />
  );
}

export default function Mission2Quiz() {
  const [answers, setAnswers] = useState({});
  const [graded, setGraded] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const val = (id) => answers[id] || "";
  const onChange = (id, v) => setAnswers((p) => ({ ...p, [id]: v }));
  const numCorrect = BLANKS.filter((b) => normalize(val(b.id)) === normalize(b.answer)).length;

  const reset = () => {
    setAnswers({});
    setGraded(false);
    setShowKey(false);
  };

  const btn = {
    primary: {
      background: C.accent, color: "#fff", border: "none",
      padding: "11px 20px", borderRadius: 10, fontWeight: 700,
      fontSize: 15, cursor: "pointer",
    },
    secondary: {
      background: "#eceef5", color: C.ink, border: "1px solid #d7dbe6",
      padding: "11px 20px", borderRadius: 10, fontWeight: 600,
      fontSize: 15, cursor: "pointer",
    },
    link: {
      background: "transparent", color: C.accent, border: "none",
      padding: "11px 6px", fontSize: 15, fontWeight: 600, cursor: "pointer",
      textDecoration: "underline",
    },
  };

  const chip = {
    fontFamily: mono, background: "#eef1f8", color: C.accentDark,
    padding: "2px 7px", borderRadius: 6, fontWeight: 700, fontSize: 13,
  };

  return (
    <div style={{ minHeight: "100%", background: C.pageBg, padding: "24px 14px", boxSizing: "border-box" }}>
      <style>{`
        .blank::placeholder { color: #6b7488; }
        .blank:focus { outline: none; border-color: #818cf8 !important; box-shadow: 0 0 0 2px rgba(129,140,248,0.30); }
        button:focus-visible { outline: 2px solid #4f46e5; outline-offset: 2px; }
      `}</style>

      <div style={{
        maxWidth: 720, margin: "0 auto", background: C.card,
        borderRadius: 18, padding: "26px 22px",
        boxShadow: "0 8px 30px rgba(20,25,45,0.08)", boxSizing: "border-box",
      }}>
        {/* Header */}
        <div style={{ fontFamily: mono, fontSize: 12.5, fontWeight: 700, color: C.accent, letterSpacing: 0.4 }}>
          # 과제2 · 데일리 퀴즈
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.ink, margin: "8px 0 6px", lineHeight: 1.3 }}>
          🧩 self.○○ vs 그냥 변수, 뭘 넣어야 할까?
        </h1>
        <p style={{ fontSize: 14.5, lineHeight: 1.7, color: C.sub, margin: "0 0 18px" }}>
          아래는 문제를 섞어서 내고 점수를 매기는 퀴즈 게임의 일부예요. 로직을 따라가며 4개의 빈칸을 채워보세요.
          각 자리에 <b style={{ color: C.ink }}>객체에 저장된 값(self.○○)</b>을 써야 할지,{" "}
          <b style={{ color: C.ink }}>그냥 변수</b>를 써야 할지 판단하는 게 포인트입니다.
        </p>

        {/* Code */}
        <div style={{ background: C.codeBg, borderRadius: 12, padding: "16px 14px", overflowX: "auto" }}>
          <div style={lineStyle}>{"import random"}</div>
          <div style={lineStyle}>{"\u00A0"}</div>
          <div style={lineStyle}>{"class QuizGame:"}</div>
          <div style={lineStyle}>{"    def __init__(self, quizzes):"}</div>
          <div style={lineStyle}>{"        "}{cmt("# 밖에서 받은 문제 목록을 객체 안에 저장한다")}</div>
          <div style={lineStyle}>{"        self.quizzes = "}<Blank b={BLANKS[0]} value={val("b1")} onChange={onChange} graded={graded} /></div>
          <div style={lineStyle}>{"        self.score = 0"}</div>
          <div style={lineStyle}>{"\u00A0"}</div>
          <div style={lineStyle}>{"    def run(self):"}</div>
          <div style={lineStyle}>{"        "}{cmt("# 원본 순서는 지키고, 섞을 복사본을 따로 만든다")}</div>
          <div style={lineStyle}>{"        order = "}<Blank b={BLANKS[1]} value={val("b2")} onChange={onChange} graded={graded} />{"[:]"}</div>
          <div style={lineStyle}>{"        random.shuffle("}<Blank b={BLANKS[2]} value={val("b3")} onChange={onChange} graded={graded} />{")"}</div>
          <div style={lineStyle}>{"\u00A0"}</div>
          <div style={lineStyle}>{"        for quiz in order:"}</div>
          <div style={lineStyle}>{"            user_answer = input(quiz["}{str('"question"')}{"] + "}{str('" > "')}{")"}</div>
          <div style={lineStyle}>{"            if user_answer == quiz["}{str('"answer"')}{"]:"}</div>
          <div style={lineStyle}>{"                "}<Blank b={BLANKS[3]} value={val("b4")} onChange={onChange} graded={graded} />{" += 1"}</div>
          <div style={lineStyle}>{"                print("}{str('"정답!"')}{")"}</div>
          <div style={lineStyle}>{"            else:"}</div>
          <div style={lineStyle}>{"                print("}{str('"오답!"')}{")"}</div>
          <div style={lineStyle}>{"\u00A0"}</div>
          <div style={lineStyle}>{"        print("}{str('f"점수: {self.score} / {len(order)}"')}{")"}</div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginTop: 18 }}>
          <button style={btn.primary} onClick={() => setGraded(true)}>채점하기</button>
          <button style={btn.secondary} onClick={reset}>다시 풀기</button>
          <button style={btn.link} onClick={() => setShowKey((s) => !s)}>
            {showKey ? "정답·해설 숨기기" : "정답·해설 보기"}
          </button>
        </div>

        {/* Score banner */}
        {graded && (
          <div style={{
            marginTop: 16, padding: "12px 16px", borderRadius: 10, fontSize: 14.5, fontWeight: 600,
            background: numCorrect === 4 ? C.okBannerBg : C.amberBg,
            color: numCorrect === 4 ? C.okBanner : C.amber,
          }}>
            {numCorrect === 4
              ? "🎉 4문제 모두 정답! 객체 상태와 지역 변수를 정확히 구분했네요."
              : "4문제 중 " + numCorrect + "개 정답 — 초록색은 정답, 빨간색은 다시 볼 칸이에요. 고쳐서 다시 채점해도 돼요."}
          </div>
        )}

        {/* Answer key & explanation */}
        {showKey && (
          <div style={{ marginTop: 20 }}>
            <div style={{ background: "#f1f5ff", border: "1px solid #dfe6fb", borderRadius: 12, padding: "16px" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, marginBottom: 8 }}>💡 핵심 개념</div>
              <div style={{ fontSize: 14.5, lineHeight: 1.75, color: C.sub }}>
                한 줄 요약: <b style={{ color: C.accent }}>이 값이 함수가 끝난 뒤에도 필요하면 <code style={{ fontFamily: mono }}>self.</code>, 아니면 그냥 변수.</b>
                <div style={{ marginTop: 10 }}>
                  • <code style={{ fontFamily: mono, color: C.ink }}>self.quizzes</code>, <code style={{ fontFamily: mono, color: C.ink }}>self.score</code> → 객체가 계속 들고 다니는 <b style={{ color: C.ink }}>상태</b>. 다른 메서드에서도, 함수가 끝난 뒤에도 살아있어요.
                </div>
                <div style={{ marginTop: 6 }}>
                  • <code style={{ fontFamily: mono, color: C.ink }}>quizzes</code>(매개변수), <code style={{ fontFamily: mono, color: C.ink }}>order</code>(복사본) → 그 함수 안에서만 잠깐 살다 사라지는 <b style={{ color: C.ink }}>지역 변수</b>.
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {BLANKS.map((b, i) => (
                <div key={b.id} style={{ background: "#fbfbfd", border: "1px solid #e7e9f0", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 14.5, color: C.ink }}>
                    <span style={{ fontWeight: 800 }}>{(i + 1) + ". 정답: "}</span>
                    <code style={chip}>{b.answer}</code>
                    <span style={{ color: C.codeComment, marginLeft: 8, fontFamily: mono, fontSize: 13 }}>{b.where}</span>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.7, color: C.sub }}>{b.explain}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 18, fontSize: 12.5, color: C.codeComment, textAlign: "center" }}>
          정답은 대소문자·공백에 관계없이 채점돼요.
        </div>
      </div>
    </div>
  );
}

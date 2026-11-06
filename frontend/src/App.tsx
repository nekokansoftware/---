
import { useState } from "react";
import Result from "./pages/Result";
import Ranking from "./pages/Ranking";

function App() {
  const [screen, setScreen] = useState<"result" | "ranking">("result");


  const actual = 1;

  // 仮の回答数
  const answer = 5;

  // 仮のニックネーム
  const nickname = "ねこたろう";

  // 今回の体験者の記録ID
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);

  // ランキング画面に移動する
  const handleRanking = (entryId: string) => {
    setCurrentEntryId(entryId);
    setScreen("ranking");
  };

  return (
    <>
      {screen === "result" && (
        <Result
          answer={answer}
          actual={actual}
          nickname={nickname}
          onRanking={handleRanking}
        />
      )}

      {screen === "ranking" && (
        <Ranking currentEntryId={currentEntryId} />
      )}
    </>
  );
}

export default App;

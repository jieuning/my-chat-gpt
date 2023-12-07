"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown'

type Chat = {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {

  const { theme, setTheme } = useTheme();
  const [text, setText] = useState("");

  console.log("theme", theme)

  // async await 쓸 때 즉시 실행 함수로 사용
  // useEffect 함수에서 사용하면 X
  useEffect(() => {
    (async () => {
      const response = await fetch("/api/chat", {
        method: 'POST',
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: 'react의 useState의 코드 예시를 보여줘.'
          }]
        })
      })

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      let content = "";

      // 조건이 맞지 않으면 무한 루프를 돈다.
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const decodedValue = decoder.decode(value);
        content += decodedValue;

        setText(content);
      }

    })()
  }, [])

  return (
    <>
      <div className='text-red-600'>
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
      <div onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        {theme === "dark" ? "🌞 light모드로 변환" : "🌚 dark모드로 변환"}
      </div>
    </>
  )
}

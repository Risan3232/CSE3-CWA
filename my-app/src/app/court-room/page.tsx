"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function CourtRoom() {
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [inputTimer, setInputTimer] = useState(30); // User-set timer value
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [stage, setStage] = useState(1);
  const [code, setCode] = useState("console.log('Hello World')");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Debug logging
  useEffect(() => {
    console.log("Game state:", { timer, messages, stage });
  }, [timer, messages, stage]);

  // Timer countdown effect
  useEffect(() => {
    if (isRunning && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            handleMessage();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [isRunning, timer]);

  const startTimer = () => {
    if (timer > 0) {
      setIsRunning(true);
    } else {
      setTimer(inputTimer);
      setIsRunning(true);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resetTimer = () => {
    setTimer(inputTimer);
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleMessage = () => {
    switch (stage) {
      case 1:
        setMessages((prev) => [
          ...prev,
          "⚖️ Court is now in session! You have a bug to fix.",
        ]);
        setStage(2);
        break;
      case 2:
        setMessages((prev) => [
          ...prev,
          "⏰ Time's up! The judge is waiting for your solution.",
        ]);
        setStage(3);
        break;
      case 3:
        setMessages((prev) => [
          ...prev,
          "⚡ Final warning! Submit your debugged code now!",
        ]);
        setStage(4);
        break;
      case 4:
        setMessages((prev) => [...prev, "🔨 Case closed! Game over."]);
        break;
      default:
        break;
    }
  };

  const newGame = () => {
    resetTimer();
    setMessages([]);
    setStage(1);
    setCode("console.log('Hello World')");
  };

  const submitCode = () => {
    if (code.trim() === "") {
      setMessages((prev) => [...prev, "❌ Invalid code! Try again."]);
    } else {
      setMessages((prev) => [
        ...prev,
        `✅ Code submitted: ${code}. Judge is reviewing...`,
      ]);
      setStage((prev) => Math.min(prev + 1, 4));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          ⚖️ Court Room Challenge
        </h1>

        {/* Timer Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Timer Control
          </h2>
          <div className="flex flex-col items-center space-y-4">
            <div className="text-6xl font-mono font-bold text-blue-600 dark:text-blue-400">
              {formatTime(timer)}
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-gray-700 dark:text-gray-300">
                Set Timer (seconds):
              </label>
              <input
                type="number"
                value={inputTimer}
                onChange={(e) => setInputTimer(Number(e.target.value))}
                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 w-20 text-center bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                min="1"
                disabled={isRunning}
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={startTimer}
                disabled={isRunning}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                <Image src="/icons/start-timer.svg" alt="Start" width={24} height={24} />
                <span>Start</span>
              </button>

              <button
                onClick={stopTimer}
                disabled={!isRunning}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                <Image src="/icons/stop-timer.svg" alt="Stop" width={24} height={24} />
                <span>Stop</span>
              </button>

              <button
                onClick={resetTimer}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                <Image src="/icons/reset-timer.svg" alt="Reset" width={24} height={24} />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Game Play Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Debug the Code
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Stage {stage} of 4 - Fix the bug and submit before time runs out!
          </p>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-32 border border-gray-300 dark:border-gray-600 rounded p-3 font-mono bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
            placeholder="Write your code here..."
          />

          <div className="flex space-x-4 mt-4">
            <button
              onClick={submitCode}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Submit Code
            </button>

            <button
              onClick={handleMessage}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Trigger Message
            </button>
          </div>
        </div>

        {/* Messages Output */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Court Messages
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 italic">
                No messages yet. Start the game!
              </p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-gray-800 dark:text-white"
                >
                  {msg}
                </div>
              ))
            )}
          </div>
        </div>

        {/* New Game Button */}
        <div className="text-center">
          <button
            onClick={newGame}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg transition transform hover:scale-105"
          >
            🎮 New Game
          </button>
        </div>
      </div>
    </div>
  );
}
    

    
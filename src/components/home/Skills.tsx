"use client";
import { SubTitle } from "@/components/Titile";
import { Section, WrapSection } from "@/components/Section";
import SkillCard from "@/components/SkillCard";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { getSkills } from "@/sanity/lib/sanityApi";
const skillsData = await getSkills();
const rawSkills = Array.isArray(skillsData) ? skillsData[0] : {};

const SKILLS = {
  LANGUAGES: rawSkills.languages || [],
  FRAMEWORKS: rawSkills.frameworks || [],
  TOOLS: rawSkills.tools || [],
  Mobile: rawSkills.mobile || [],
  DATABASE: rawSkills.database || [],
  OTHERS: rawSkills.others || [],
};

interface SkillsData {
  [key: string]: string[];
}

interface TerminalHistoryItem {
  type: "command" | "output" | "error";
  text: string;
}

const typeText = (
  text: string,
  setDisplay: React.Dispatch<React.SetStateAction<string>>,
  delay = 30
): Promise<void> => {
  return new Promise((resolve) => {
    let i = 0;
    setDisplay("");
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplay((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
        resolve();
      }
    }, delay);
  });
};

export default function Skills({ home = false }) {
  const [showTerminal, setShowTerminal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [terminalHistory, setTerminalHistory] = useState<TerminalHistoryItem[]>(
    []
  );
  const [currentInput, setCurrentInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [currentTypingText, setCurrentTypingText] = useState<string>("");
  const terminalOutputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const typedSkills: SkillsData = SKILLS as SkillsData;
  const skillCategories = Object.keys(typedSkills);
  const allCategories = ["ALL", ...skillCategories];

  const scrollToBottom = () => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop =
        terminalOutputRef.current.scrollHeight;
    }
  };

  const addToHistory = (type: "command" | "output" | "error", text: string) => {
    setTerminalHistory((prev) => [...prev, { type, text }]);
  };

  const processCommand = useCallback(
    async (command: string, isUserInput: boolean = false) => {
      if (isTyping) return;

      const fullCommandText = command.toLowerCase().trim();
      const prompt = `➜ ~ ${fullCommandText}`;
      let output = "";
      let categoryToShow: string | null = null;
      let error = false;
      if (isUserInput) {
        addToHistory("command", prompt);
        setCurrentInput("");
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Determine command result
      if (
        fullCommandText === "ls" ||
        fullCommandText === "/ls" ||
        fullCommandText === "help"
      ) {
        output = `Available commands:
${allCategories.map((cat) => `  /${cat.toLowerCase()}`).join("\n")}

Usage: Type a command like '/languages' or '/frameworks' to see skills.
       Use 'clear' to clear the terminal.
       Use 'help' or 'ls' to see this message.`;
        categoryToShow = activeCategory;
      } else if (fullCommandText === "clear") {
        setTerminalHistory([]);
        return;
      } else if (fullCommandText.startsWith("/")) {
        const requestedCategory = fullCommandText.substring(1).toUpperCase();

        if (typedSkills.hasOwnProperty(requestedCategory)) {
          output = `${requestedCategory} Skills:\n${typedSkills[
            requestedCategory
          ]
            .map((skill) => `  • ${skill}`)
            .join("\n")}`;
          categoryToShow = requestedCategory;
        } else if (requestedCategory === "ALL") {
          output = allCategories
            .filter((cat) => cat !== "ALL")
            .map((cat) => {
              const skillsArray = typedSkills[cat];
              return `\n${cat}:\n${skillsArray
                .map((skill) => `  • ${skill}`)
                .join("\n")}`;
            })
            .join("");
          categoryToShow = "ALL";
        } else {
          output = `Error: Category '${requestedCategory}' not found. Type 'help' for available commands.`;
          error = true;
          categoryToShow = activeCategory;
        }
      } else if (fullCommandText === "") {
        return;
      } else {
        output = `Command '${fullCommandText}' not found. Type 'help' for available commands.`;
        error = true;
        categoryToShow = activeCategory;
      }

      setIsTyping(true);
      await typeText(output, setCurrentTypingText, 20);

      addToHistory(error ? "error" : "output", output);
      setCurrentTypingText("");
      setIsTyping(false);

      if (categoryToShow) {
        setActiveCategory(categoryToShow);
      }
      setTimeout(scrollToBottom, 50);
    },
    [typedSkills, allCategories, activeCategory, isTyping]
  );

  // Initialize terminal when it's opened
  useEffect(() => {
    if (showTerminal && terminalHistory.length === 0) {
      const initTerminal = async () => {
        addToHistory(
          "output",
          "Welcome to Skills Terminal! Type 'help' for available commands."
        );
        // await new Promise((resolve) => setTimeout(resolve, 500));
        // processCommand("/all");
      };

      initTerminal();
    }
  }, [showTerminal, terminalHistory.length, processCommand]);

  useEffect(() => {
    if (showTerminal && inputRef.current) {
      const focusTimeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(focusTimeout);
    }
  }, [showTerminal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isTyping) {
      setCurrentInput(e.target.value);
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentInput.trim() !== "" && !isTyping) {
      processCommand(currentInput.trim(), true);
    }
  };

  const handleButtonClick = (category: string) => {
    if (isTyping) return;

    const command = `/${category.toLowerCase()}`;

    addToHistory("command", `➜ ~ ${command}`);

    processCommand(command);
  };

  // Auto-scroll when history updates
  useEffect(() => {
    if (showTerminal) {
      scrollToBottom();
    }
  }, [terminalHistory, currentTypingText, showTerminal]);

  // Focus input when clicking on terminal
  const handleTerminalClick = () => {
    if (inputRef.current && !isTyping) {
      inputRef.current.focus();
    }
  };

  return (
    <Section>
      <WrapSection>
        <div
          className={`grid grid-cols-1 gap-y-4 gap-x-10 ${home ? "md:grid-cols-[3fr_4fr]" : ""}`}
        >
          <SubTitle line={home}>
            GET /api/skills<span className="text-green-500">&nbsp; 200 OK</span>
          </SubTitle>

          {home && (
            <>
              <div className="hidden md:block"></div>
              {/* <div className="relative hidden w-full h-[282px] md:block">
                <DotsSVG className="absolute top-[10%] left-0 w-18 h-18" />
                <DotsSVG className="absolute top-[40%] left-[40%] w-14 h-14" />
                <DesignSVG className="absolute bottom-0 left-0 w-38 h-38" />
                <RectangleSVG className="absolute top-0 right-[15%] w-24 h-24" />
                <RectangleSVG className="absolute bottom-[15%] right-[5%] w-16 h-16" />
              </div> */}
            </>
          )}

          {/* Toggle Terminal Button */}
          <div className="col-span-full flex justify-center mb-4">
            <button
              onClick={() => setShowTerminal(!showTerminal)}
              className={`px-6 py-3  font-semibold transition-all duration-300 transform hover:scale-105 ${
                showTerminal
                  ? "bg-white  text-black shadow-lg"
                  : "bg-white text-black shadow-md hover:shadow-lg"
              }`}
            >
              {showTerminal ? "Close Terminal" : "Open Terminal"}
            </button>
          </div>

          {/* Terminal View */}
          {showTerminal && (
            <div className="col-span-full mb-6">
              <div
                className="bg-black border  rounded-lg shadow-lg shadow-[#7cfc00] overflow-hidden font-mono text-sm h-[400px] flex flex-col cursor-text"
                onClick={handleTerminalClick}
              >
                {/* Terminal Header */}
                <div className="flex-none h-8 bg-gray-900 flex items-center px-3 rounded-t-lg">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span className="ml-auto text-white text-sm">
                    skills@portfolio:~
                  </span>
                </div>

                {/* Terminal Content */}
                <div
                  ref={terminalOutputRef}
                  className="flex-grow p-3 overflow-y-auto whitespace-pre-wrap text-gray-200"
                >
                  {/* Terminal History */}
                  {terminalHistory.map((item, index) => (
                    <div key={index} className="mb-2">
                      {item.type === "command" && (
                        <span className="text-green-400">{item.text}</span>
                      )}
                      {item.type === "output" && (
                        <span className="text-gray-200">{item.text}</span>
                      )}
                      {item.type === "error" && (
                        <span className="text-red-400">{item.text}</span>
                      )}
                    </div>
                  ))}

                  {/* Currently Typing Text */}
                  {isTyping && currentTypingText && (
                    <div className="mb-2">
                      <span className="text-gray-200">{currentTypingText}</span>
                      <span className="animate-pulse">▋</span>
                    </div>
                  )}

                  {/* Input Line */}
                  <div className="text-green-400 flex items-center">
                    <span>➜ ~ </span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={currentInput}
                      onChange={handleInputChange}
                      onKeyPress={handleInputKeyPress}
                      className="flex-grow bg-transparent outline-none border-none text-gray-400 ml-1 caret-green-400"
                      disabled={isTyping}
                      placeholder={
                        isTyping ? "Processing..." : "Type a command..."
                      }
                    />
                    {!isTyping && (
                      <span className="animate-pulse text-green-400">▋</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div
            className={`mt-0 grid grid-cols-2 gap-3 sm:grid-cols-3 ${
              home ? "" : "md:grid-cols-4 lg:grid-cols-5"
            } col-span-full ${showTerminal ? "hidden" : ""}`}
          >
            <div
              className={`mt-0 grid grid-cols-2 gap-3 sm:grid-cols-3 ${home ? "" : "md:grid-cols-4 lg:grid-cols-5"} col-span-full`}
            >
              <SkillCard title="Languages" skills={SKILLS.LANGUAGES} />
              <SkillCard title="Frameworks" skills={SKILLS.FRAMEWORKS} />
              <SkillCard title="Database" skills={SKILLS.DATABASE} />
              <SkillCard title="Mobile Development" skills={SKILLS.Mobile} />

              <SkillCard title="Tools" skills={SKILLS.TOOLS} />

              <SkillCard title="Others" skills={SKILLS.OTHERS} />
            </div>
          </div>
        </div>
      </WrapSection>
    </Section>
  );
}

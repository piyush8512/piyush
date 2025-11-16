import React from "react";
import { ReactNode } from "react";
interface SkillCardProps {
  title: string;
  skills: ReactNode[];
  block?: boolean;
}

const SkillCard: React.FC<SkillCardProps> = ({
  title,
  skills,
  block = false,
}) => {
  return (
    <div className="h-fit border border-primary/40">
      <h5 className="px-2 py-1">{title}</h5>
      <ul
        className={`py-2 px-1 flex gap-x-2 gap-y-1 border-t border-primary/40 ${
          block ? "flex-col" : "flex-row flex-wrap"
        }`}
      >
        {(skills || []).map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  );
};

export default SkillCard;

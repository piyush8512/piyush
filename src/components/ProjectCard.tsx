import { APPLINK_VARIANTS } from "@/utils/contant";
// import { PrimaryText, SecondaryText } from "@/components/text";

import { PrimaryText } from "@/components/text";
import Image from "next/image";
import AppLink from "./app-link";

export const ProjectCard = ({
  project,
  image = true,
  lineClamp = 3,
}: {
  project: any;
  image?: boolean;
  lineClamp?: number;
}) => {
  return (
    <div className="w-full h-fit border border-tertiary flex flex-col">
      {image && (
        <div className="relative w-full aspect-video">
          <Image
            src={project.image_url}
            alt={project?.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={project?.portrait ? "object-contain" : "object-cover"}
            priority={false}
          />
        </div>
      )}
      <div className="border-y border-y-tertiary flex flex-wrap items-center gap-2 p-2 overflow-x-auto">
        {Array.isArray(project?.stack) &&
          project.stack.map((stack: string) => (
            <PrimaryText key={stack} className="whitespace-nowrap">
              {stack}
            </PrimaryText>
          ))}
      </div>
      <div className="flex flex-col gap-4 p-4 flex-grow">
        <h4 className="font-medium text-lg">{project?.title}</h4>

        <PrimaryText className={`line-clamp-${lineClamp} flex-grow`}>
          {project?.description}
        </PrimaryText>
        <div className="flex items-center gap-4 mt-auto">
          {project?.code && (
            <AppLink
              href={project?.code}
              title={`${project?.title} code`}
              target="_blank"
            >{`${"Code >="}`}</AppLink>
          )}
          {project?.link && (
            <AppLink
              href={project?.link}
              title={`${project?.title} live`}
              target="_blank"
              variant={APPLINK_VARIANTS.SECONDARY}
            >{`${"Live <~>"}`}</AppLink>
          )}
        </div>
      </div>
    </div>
  );
};

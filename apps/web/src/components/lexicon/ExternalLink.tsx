import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import * as React from "react";

interface Props {
  href: string;
  children: React.ReactNode;
}

const ExternalLink = ({ href, children }: Props) => {
  return (
    <a className="inline-flex items-center m-0" href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1 text-slate-700 dark:text-slate-400" />
    </a>
  );
};

export default ExternalLink;

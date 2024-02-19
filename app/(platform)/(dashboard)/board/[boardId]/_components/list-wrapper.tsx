import React from "react";

type Props = {
  children: React.ReactNode;
};

const ListWrapper = ({ children }: Props) => {
  return <li className="shrink-0 h-full w-64 select-none">{children}</li>;
};

export default ListWrapper;

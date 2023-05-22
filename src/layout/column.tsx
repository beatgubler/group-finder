import { ReactNode } from "react";

type ColumnProps = {
  full?: boolean;
  children: ReactNode;
};

function Column(props: ColumnProps) {
  return <div className={`mx-auto grid grid-cols-6 px-4 max-w-screen-xl gap-4`}>{props.children}</div>;
}

export default Column;

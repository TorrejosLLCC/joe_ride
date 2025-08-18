import type { FC, ReactNode } from "react";

export const Card: FC<{ children: ReactNode; className?: string }>=({children, className=""})=>{
	return <div className={`card ${className}`}>{children}</div>
};

import React from "react";

interface GroupTitleProps {
  icon: React.ReactNode;
  children: React.ReactNode;
}

const GroupTitle: React.FC<GroupTitleProps> = ({ icon, children }) => (
  <div className="flex items-center gap-2 mb-2">
    {icon}
    <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-1 text-sm uppercase tracking-wide flex-1">
      {children}
    </h3>
  </div>
);

export default GroupTitle;

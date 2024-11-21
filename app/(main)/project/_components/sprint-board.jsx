"use client";
import { useState } from "react";
import SprintManager from "./sprint-manager";

const SprintBoard = ({ sprints, projectId, orgId }) => {
  const defaultSprint =
    sprints.find((s) => s.status === "ACTIVE") || sprints[0];
  const [currentSprint, setCurrentSprint] = useState(defaultSprint);
  return (
    <div>
      {/* SPRINT MANAGER */}
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />
      {/* KANBAN BOARD */}
    </div>
  );
};

export default SprintBoard;

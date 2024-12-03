"use client";
import { useEffect, useState } from "react";
import SprintManager from "./sprint-manager";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import statuses from "@/data/status.json";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateIssueDrawer from "./create-issue";
import useFetch from "@/hooks/use-fetch";
import { getIssuesForSprint } from "@/actions/issues";
import { BeatLoader } from "react-spinners";
import IssueCard from "@/components/isssue-card";

const SprintBoard = ({ sprints, projectId, orgId }) => {
  const defaultSprint =
    sprints.find((s) => s.status === "ACTIVE") || sprints[0];
  const [currentSprint, setCurrentSprint] = useState(defaultSprint);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const onDragEnd = () => {};

  const {
    data: issues,
    loading: issuesLoading,
    error: issuesError,
    fn: fetchIssues,
    setData: setIssues,
  } = useFetch(getIssuesForSprint);
  const [filterdIssues, setFilterdIssues] = useState(issues);

  useEffect(() => {
    if (currentSprint.id) {
      fetchIssues(currentSprint.id);
    }
  }, [currentSprint.id]);

  const handleIssueCreated = () => {
    // Fetch issues again
    fetchIssues(currentSprint.id);
  };
  const handleAddIssue = (status) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };

  if (issuesError) return <div>Error loading Issues</div>;
  return (
    <div>
      {/* SPRINT MANAGER */}
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />
      {issuesLoading && (
        <BeatLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}
      {/* KANBAN BOARD */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900 p-4 rounded-1g">
          {statuses.map((column) => (
            <Droppable key={column.key} droppableId={column.key}>
              {(provided) => {
                return (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    <h3 className="font-semibold mb-2 text-center">
                      {column.name}
                    </h3>
                    {/* Issues */}
                    {issues
                      ?.filter((issue) => issue.status === column.key)
                      .map((issue, index) => (
                        <Draggable
                          key={issue.id}
                          draggableId={issue.id}
                          index={index}
                        >
                          {(provided) => {
                            return (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                {...provided.dragHandleProps}
                              >
                                <IssueCard issue={issue} />
                              </div>
                            );
                          }}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                    {column.key === "TODO" &&
                      currentSprint.status !== "COMPLETED" && (
                        <Button
                          variant="ghost"
                          className="w-full"
                          onClick={() => handleAddIssue(column.key)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create Issue
                        </Button>
                      )}
                  </div>
                );
              }}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Create Issue Drawer */}
      <CreateIssueDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sprintId={currentSprint.id}
        status={selectedStatus}
        projectId={projectId}
        onIssueCreated={handleIssueCreated}
        orgId={orgId}
      />
    </div>
  );
};

export default SprintBoard;

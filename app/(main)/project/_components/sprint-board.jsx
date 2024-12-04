"use client";
import { useEffect, useState } from "react";
import SprintManager from "./sprint-manager";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import statuses from "@/data/status.json";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateIssueDrawer from "./create-issue";
import useFetch from "@/hooks/use-fetch";
import { getIssuesForSprint, UpdateIssueOrder } from "@/actions/issues";
import { BeatLoader } from "react-spinners";
import IssueCard from "@/components/isssue-card";
import { toast } from "sonner";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const SprintBoard = ({ sprints, projectId, orgId }) => {
  const defaultSprint =
    sprints.find((s) => s.status === "ACTIVE") || sprints[0];
  const [currentSprint, setCurrentSprint] = useState(defaultSprint);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const {
    loading: updateIssueOrderLoading,
    error: updateIssueOrderError,
    fn: updateIssueOrderFn,
  } = useFetch(UpdateIssueOrder);

  const onDragEnd = async (result) => {
    if (currentSprint.status === "PLANNED") {
      toast.warning("Start the sprint to update the board");
      return;
    }
    if (currentSprint.status === "COMPLETED") {
      toast.warning("Cannot update board after sprint end ");
      return;
    }
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newOrderedData = [...issues];
    const sourceList = newOrderedData.filter(
      (list) => list.status === source.droppableId
    );
    const destinationList = newOrderedData.filter(
      (list) => list.status === destination.droppableId
    );
    console.log(
      "result: ",
      result,
      newOrderedData,
      sourceList,
      destinationList
    );

    // Reorder in Same column
    if (source.droppableId === destination.droppableId) {
      const reOrderedCards = reorder(
        sourceList,
        source.index,
        destination.index
      );
      reOrderedCards.forEach((card, index) => {
        card.order = index;
      });
    } else {
      //Move card in different column
      const [movedCard] = sourceList.splice(source.index, 1);
      movedCard.status = destination.droppableId;
      destinationList.splice(destination.index, 1, movedCard);

      // For Sorting update order in SourceList/ DestinationList on order
      sourceList.forEach((card, index) => {
        card.order = index;
      });
      destinationList.forEach((card, index) => {
        card.order = index;
      });
    }
    const sortedIssues = newOrderedData.sort((a, b) => a.order - b.order);
    setIssues(newOrderedData, sortedIssues);

    //API call
    updateIssueOrderFn(sortedIssues);
  };

  const {
    data: issues,
    loading: issuesLoading,
    error: issuesError,
    fn: fetchIssues,
    setData: setIssues,
  } = useFetch(getIssuesForSprint);
  const [filteredIssues, setFilteredIssues] = useState(issues);
  const handleFilterChange = (newFilteredIssues) => {
    setFilteredIssues(newFilteredIssues);
  };

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

  const updateIssue = (updated) => {
    setIssues((issues) =>
      issues.map((issue) => (issue.id === updated.id ? updated : issue))
    );
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
      {updateIssueOrderError && (
        <p className="text-red-500 mt-2"> {updateIssueOrderError.message}</p>
      )}
      {(issuesLoading || updateIssueOrderLoading) && (
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
                      .map((issue, index) => {
                        return (
                          <Draggable
                            key={issue.id}
                            draggableId={issue.id}
                            index={index}
                            isDragDisabled={updateIssueOrderLoading}
                          >
                            {(provided) => {
                              return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <IssueCard
                                    issue={issue}
                                    onDelete={() =>
                                      fetchIssues(currentSprint.id)
                                    }
                                    onUpdate={(updated) => updateIssue(updated)}
                                  />
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
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

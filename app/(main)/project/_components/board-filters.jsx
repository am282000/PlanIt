import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const BoardFilters = ({ issues, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState("");
  const uniqueAssignees = issues
    .map((issue) => issue.assignee)
    .filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    );
  const isFilterApplied =
    searchTerm !== "" ||
    selectedAssignees.length > 0 ||
    selectedPriority !== "";

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedAssignees([]);
    setSelectedPriority("");
  };
  const toggleAssignee = (assigneeId) => {
    setSelectedAssignees((prev) =>
      prev.includes(assigneeId)
        ? prev.filter((id) => id !== assigneeId)
        : [...prev, assigneeId]
    );
  };

  useEffect(() => {
    const filteredIssues = issues.filter((issue) => {
      return (
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedAssignees.length === 0 ||
          selectedAssignees.includes(issue.assignee?.id)) &&
        (selectedPriority === "" || selectedPriority === issue.priority)
      );
    });
    onFilterChange(filteredIssues);
  }, [searchTerm, selectedAssignees, selectedPriority, issues]);
  console.log("issues: ", issues);

  return (
    <div>
      {issues?.length !== 0 && (
        <div className="flex flex-col gap-4 pr-2 sm:flex-row sm:gap-6 mt-4 ">
          <Input
            className="w-full sm:w-72"
            placeholder="Search issues"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex-shrink-0">
            <div className="flex gap-2 flex-wrap">
              {uniqueAssignees.map((assignee, index) => {
                const selected = selectedAssignees.includes(assignee.id);
                return (
                  <div
                    key={assignee.id}
                    className={`rounded-full ring ${
                      selected ? "ring-blue-600" : "ring-black"
                    } ${index > 0 ? "-ml-6" : ""}`}
                    style={{
                      zIndex: index,
                    }}
                    onClick={() => toggleAssignee(assignee.id)}
                  >
                    <Avatar>
                      <AvatarImage src={assignee.imageUrl} />
                      <AvatarFallback>{assignee.name}</AvatarFallback>
                    </Avatar>
                  </div>
                );
              })}
            </div>
          </div>

          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isFilterApplied && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="flex items-center bg-slate-700"
            >
              <X className=" h-4 w-4 mr-1" /> Clear Fillters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default BoardFilters;

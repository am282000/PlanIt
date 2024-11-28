"use client";
import { updateSprintStatus } from "@/actions/sprints";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { isAfter, isBefore, format, formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const SprintManager = ({ sprint, setSprint, sprints, projectId }) => {
  const [status, setStatus] = useState(sprint.status);
  const now = new Date();
  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);

  //   Now is after START , and before END
  const canStart =
    isAfter(now, startDate) && isBefore(now, endDate) && status === "PLANNED";

  const canEnd = status === "ACTIVE";

  const {
    fn: updateStatus,
    loading,
    data: updatedStatus,
  } = useFetch(updateSprintStatus);

  const handleStatusChange = async (newStatus) => {
    console.log(newStatus, updatedStatus, updateStatus);
    updateStatus(sprint.id, newStatus);
  };

  useEffect(() => {
    if (updatedStatus && updatedStatus.success) {
      setStatus(updatedStatus.sprint.status);
      setSprint({
        ...sprint,
        status: updatedStatus.sprint.status,
      });
    }
  }, [updatedStatus, loading]);

  const handleSprintChange = (sprintId) => {
    const selectedSprint = sprints.find((s) => s.id === sprintId);
    setSprint(selectedSprint);
    setStatus(selectedSprint.status);
  };
  const getStatusText = () => {
    if (status === "COMPLETED") {
      return "Sprint Ended";
    }
    if (status === "ACTIVE" && isAfter(now, endDate)) {
      return `Overdue by ${formatDistanceToNow(endDate)}`;
    }
    if (status === "PLANNED" && isBefore(now, startDate)) {
      return `Starts in ${formatDistanceToNow(startDate)}`;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <Select value={sprint.id} onValueChange={handleSprintChange}>
          <SelectTrigger className="bg-slate-950 self-start">
            <SelectValue placeholder="Select Sprint" />
          </SelectTrigger>
          <SelectContent>
            {sprints.map((sprint) => {
              return (
                <SelectItem key={sprint.id} value={sprint.id}>
                  {`${sprint.name} (${format(
                    sprint.startDate,
                    "MMM dd, yyyy"
                  )} to ${format(sprint.endDate, "MMM dd, yyyy")})`}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {canStart && (
          <Button
            className="bg-green-700 text-white hover:bg-green-800"
            disabled={loading}
            onClick={() => handleStatusChange("ACTIVE")}
          >
            Start Sprint
          </Button>
        )}
        {canEnd && (
          <Button
            variant="destructive"
            disabled={loading}
            onClick={() => handleStatusChange("COMPLETED")}
          >
            End Sprint
          </Button>
        )}
      </div>
      {loading && <BarLoader width={"100%"} className="mt-2" color="#36d7b7" />}
      {getStatusText() && (
        <Badge className="mt-3 ml-1 self-start"> {getStatusText()}</Badge>
      )}
    </>
  );
};

export default SprintManager;

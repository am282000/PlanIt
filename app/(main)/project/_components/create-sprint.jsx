"use client";

import { createSprint } from "@/actions/sprints";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useFetch from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import classNames from "react-day-picker/style.module.css";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { sprintSchema } from "../../lib/validators";

const CreateSprint = ({ projectTitle, projectKey, projectId, sprintKey }) => {
  const [showForm, setShowForm] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 14),
  });
  const formattedDateRange =
    format(dateRange.from, "MMM dd, y") +
    " - " +
    format(dateRange.to, "MMM dd, y");

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprintKey}`,
      startDate: dateRange.from,
      endDate: dateRange.to,
    },
  });

  const { loading: createSprintLoading, fn: createSprintFn } =
    useFetch(createSprint);

  const onSprintSubmit = async (data) => {
    console.log("data", data);

    await createSprintFn(projectId, {
      ...data,
      startDate: dateRange.from,
      endDate: dateRange.to,
    });
    setShowForm(false);
    toast.success("Sprint created successfully");
    router.refresh();
  };

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-5xl font-bold mb-8 gradient-title">
          {projectTitle}
        </h1>
        <Button
          className="mt-2"
          variant={showForm ? "destructive" : "default"}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Create New Sprint"}
        </Button>
      </div>
      {showForm && (
        <Card className="pt-4 mb-4">
          <CardContent>
            <form
              className="flex gap-4 items-end"
              onSubmit={handleSubmit(onSprintSubmit)}
            >
              <div className="flex-1">
                <label htmlFor="name">Name</label>
                <Input
                  id="name"
                  className="bg-slate-950"
                  readOnly
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Sprint Duration
                </label>
                <Controller
                  name="dateRange"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          {/* asChield is used to send custom Button/ Conponents in PopoverTriggger*/}
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal bg-slate-950 ${
                              !dateRange && "text-muted-foreground"
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.from && dateRange.to ? (
                              formattedDateRange
                            ) : (
                              <span> Pick a Date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto bg-slate-900"
                          align="start"
                        >
                          <DayPicker
                            mode="range"
                            selected={dateRange}
                            onSelect={(range) => {
                              if (range?.from && range?.to) {
                                setDateRange(range);
                                field.onChange(range);
                              }
                            }}
                            classNames={{
                              ...classNames,
                              chevron: "fill-blue-500",
                              range_start: "bg-red-600 rounded-l-lg",
                              range_end: "bg-red-600 rounded-r-lg",
                              range_middle: "bg-blue-500",
                              day_button: "border-none",
                              today: "font-bold bg-blue-700",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
              </div>
              <Button type="submit" disabled={createSprintLoading}>
                {createSprintLoading ? "Creating..." : "Create Sprint"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CreateSprint;

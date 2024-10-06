import { useEffect, useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import { Id, Task } from "../types";
import { useSortable } from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

interface TaskProps {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

function TaskCard({ task, deleteTask, updateTask }: TaskProps) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [timeAgo, setTimeAgo] = useState("");

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  // Function to calculate "time ago" from updatedAt date
  const calculateTimeAgo = (updatedAt: string) => {
    const currentTime = new Date();
    const taskTime = new Date(updatedAt);
    const differenceInMs = currentTime.getTime() - taskTime.getTime();
    const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

    if (differenceInDays === 0) {
      return "Updated today";
    } else if (differenceInDays === 1) {
      return "Updated 1 day ago";
    } else {
      return `Updated ${differenceInDays} days ago`;
    }
  };

  useEffect(() => {
    if (task.updatedAt) {
      setTimeAgo(calculateTimeAgo(task.updatedAt));
    }
  }, [task.updatedAt]);

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-mainBackgroundColor p-3 h-[100px] min-h-[100px] flex items-center text-left rounded-xl hover:ring-2  hover:ring-inset hover:ring-rose-500 cursor-grab relative "
      >
        <textarea
          className="h-[90%] w-full resize-none border-none  rounded bg-transparent text-white focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              toggleEditMode();
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        ></textarea>
      </div>
    );
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-mainBackgroundColor p-3 h-[100px] min-h-[100px] flex items-center text-left rounded-xl  cursor-grab relative opacity-30 border-2 border-rose-500"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="bg-mainBackgroundColor p-3 h-[100px] min-h-[100px] flex flex-col items-center text-left rounded-xl hover:ring-2  hover:ring-inset hover:ring-rose-500 cursor-grab relative task"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      {mouseIsOver && (
        <button
          className="stroke-white absolute right-4 top-1/3 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
          onClick={() => {
            deleteTask(task.id);
          }}
        >
          <TrashIcon />
        </button>
      )}

      {/* Updated Time and Progress Bar */}
      <div className="mt-2 ">
        <div className="my-auto h-[40%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
          {task.content}
        </div>
        <div className="bg-gray-200 rounded-full h-2 mt-1">
          <div
            className="bg-darkColor h-full rounded-full"
            style={{ width: "60%" }} // Example: Replace '60%' with dynamic value if needed
          ></div>
        </div>
        <p className="text-sm text-gray-500 p-2"> {timeAgo}</p>
      </div>
    </div>
  );
}

export default TaskCard;

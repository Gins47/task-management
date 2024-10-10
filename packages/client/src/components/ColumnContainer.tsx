import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";
import EditIcon from "../icons/EditIcon";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  tasks: Task[];
}

function ColumnContainer(props: Props) {
  const {
    column,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  } = props;

  const [editMode, setEditMode] = useState<boolean>(false);

  const taskIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col opacity-30 border-2 border-rose-500"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col  border-zinc-300 border-2"
    >
      {/** Title */}
      <div
        {...attributes}
        {...listeners}
        className="bg-zinc-200 text-md h-[60px] cursor-grab rounded-md  border-zinc-300 border-2 flex items-center justify-between p-3 opacity-60"
      >
        <div className="flex gap-2">
          {editMode && (
            <input
              className="bg-zinc-400 focus:border-rose-500 border rounded outline-none px-3 gap-5"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                console.log("calling edit");
                if (e.key !== "Enter") {
                  return true;
                }
                setEditMode(false);
              }}
            />
          )}
          {!editMode && (
            <div className="flex gap-2">
              <span>{column.title}</span>
              <button
                className="stroke-gray-500 "
                onClick={() => {
                  setEditMode(true);
                }}
              >
                <EditIcon />
              </button>
            </div>
          )}
        </div>
        <button
          className="stroke-gray-500 hover:stroke-black hover:bg-columnBackgroundColor rounded px-1 py-2"
          onClick={() => {
            deleteColumn(column.id);
          }}
        >
          <TrashIcon />
        </button>
      </div>
      {/** Task Container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={taskIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      {/** Footer Container */}
      <button
        className="flex gap-2 item-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:text-rose-500 active:bg-black"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <PlusIcon /> Create Case
      </button>
    </div>
  );
}

export default ColumnContainer;

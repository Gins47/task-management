import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import ApiClient from "../api/apiClient";

function KanbanBoard() {
  const [columns, setColumn] = useState<Column[]>([]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [tasks, setTask] = useState<Task[]>([]);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const columnsIds = useMemo(() => columns.map((col) => col.id), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, //3px
      },
    })
  );

  function onDragStart(event: DragStartEvent) {
    console.log(" Drag start event ", event);
    if (event.active.data?.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) {
      return;
    }

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) {
      return;
    }

    setColumn((columns) => {
      const activeColumnIndex = columns.findIndex(
        (column) => column.id === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (column) => column.id === overColumnId
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  async function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) {
      return;
    }

    const activeTaskId = active.id;
    const overTaskId = over.id;

    if (activeTaskId === overTaskId) {
      return;
    }

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;
    // Dropping a task over another task

    if (isActiveATask && isOverATask) {
      try {
        const data = { taskId1: activeTaskId, taskId2: overTaskId };
        console.log(` swap data === ${JSON.stringify(data)}`);
        await ApiClient.put("/tasks/swap", data);
        const tasks = await ApiClient.get<Task[]>("/tasks");
        console.log(`API call response , all task == ${JSON.stringify(tasks)}`);
        setTask(tasks);
      } catch (error) {
        console.error(`Error occurred when calling the api ${error}`);
      }
    }

    // Dropping a task over another column
    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      try {
        const data = { newColumnId: overTaskId };
        console.log(` move task to new column === ${JSON.stringify(data)}`);
        const tasks = await ApiClient.put<Task[]>(
          `/tasks/${activeTaskId}/move-column`,
          data
        );
        console.log(
          `API call response , moving column to task == ${JSON.stringify(tasks)}`
        );
        setTask(tasks);
      } catch (error) {
        console.error(`Error occurred when calling the api ${error}`);
      }
    }
  }

  function generateId() {
    return Math.floor(Math.random() * 1001);
  }

  async function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    console.log(` new column == ${JSON.stringify(columnToAdd)}`);
    try {
      await ApiClient.post("/columns", columnToAdd);
      const columns = await ApiClient.get<Column[]>("/columns");
      console.log(`API call response , all task == ${JSON.stringify(columns)}`);
      setColumn(columns);
    } catch (error) {
      console.error(`Error occurred when calling the api ${error}`);
    }
  }

  async function deleteColumn(id: Id) {
    console.log("Deleting the column with Id ", id);
    try {
      await ApiClient.del(`/columns/${id}`);
      await ApiClient.del(`/tasks/column/${id}`);
      const columns = await ApiClient.get<Column[]>("/columns");
      setColumn(columns);
    } catch (error) {
      console.error(`Error occurred when delete a column = ${error}`);
    }

    const filteredTasks = tasks.filter((task) => task.columnId !== id);
    setTask(filteredTasks);
  }

  function updateColumn(id: Id, title: string) {
    console.log(`Inside updateColumn`);
    const newColumns = columns.map((column) => {
      if (column.id !== id) {
        return column;
      }
      return { ...column, title };
    });
    setColumn(newColumns);
  }

  async function createTask(columnId: Id) {
    console.log(`Inside create task`);
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: ` Case ${tasks.length + 1}`,
    };

    console.log(`[...tasks, newTask]== ${JSON.stringify([...tasks, newTask])}`);

    try {
      await ApiClient.post("/tasks", newTask);
      const tasks = await ApiClient.get<Task[]>("/tasks");
      console.log(`API call response , all task == ${JSON.stringify(tasks)}`);
      setTask(tasks);
    } catch (error) {
      console.error(`Error occurred when calling the api ${error}`);
    }
  }

  async function deleteTask(id: Id) {
    console.log("calling delete task");
    try {
      await ApiClient.del(`/tasks/${id}`);
      const tasks = await ApiClient.get<Task[]>("/tasks");
      setTask(tasks);
    } catch (error) {
      console.error(`Error occurred when calling the api ${error}`);
    }
  }

  async function updateTask(id: Id, content: string) {
    try {
      await ApiClient.put(`/tasks/${id}/content`, { content });
      const tasks = await ApiClient.get<Task[]>("/tasks");
      setTask(tasks);
    } catch (error) {
      console.error(`Error occurred when calling the api ${error}`);
    }
  }

  return (
    <div className=" m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsIds}>
              {columns.map((column) => (
                <div>
                  <ColumnContainer
                    key={column.id}
                    column={column}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    createTask={createTask}
                    tasks={tasks.filter((task) => task.columnId === column.id)}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                  />
                </div>
              ))}
            </SortableContext>
          </div>
          <button
            className="h-[60px] w-[60px] min-w-[60px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-zinc-300 p-4 ring-rose-500 hover:ring-2 flex gap-2"
            onClick={createNewColumn}
          >
            <PlusIcon />
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

export default KanbanBoard;

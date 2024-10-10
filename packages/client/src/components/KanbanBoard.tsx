import { useEffect, useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import ApiClient from "../api/apiClient";

function KanbanBoard() {
  const [columns, setColumn] = useState<Column[]>([]);
  const [originalTasks, setOriginalTasks] = useState<Task[]>([]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [tasks, setTask] = useState<Task[]>([]);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const columnsIds = useMemo(() => columns.map((col) => col.id), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2, //3px
      },
    })
  );

  /**
   * Drag start
   * @param event
   */
  function onDragStart(event: DragStartEvent) {
    console.log(" Drag start event ", event.active.data.current?.type);
    const activeType = event.active.data.current?.type;

    if (activeType === "Column") {
      setActiveColumn(event.active.data.current?.column);
    } else if (activeType === "Task") {
      setActiveTask(event.active.data.current?.task);
      setOriginalTasks(tasks);
    }
  }

  /**
   *
   * Function on drag end
   *
   */
  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;

    if (!over) {
      return;
    }

    console.log(
      ` check if active , over is always the same ${active.id === over.id}`
    );

    const activeTaskId = active.id;
    const overId = over.id;

    const taskOriginal = originalTasks.filter(
      (task) => task.id === activeTaskId
    );

    console.log(
      ` check if active , over is always the taskFinal ${JSON.stringify(taskOriginal)}`
    );

    const taskFinal = tasks.filter((task) => task.id === activeTaskId);

    console.log(
      ` check if active , over is always the taskFinal ${JSON.stringify(taskFinal)}`
    );

    // TODO: Check if the task is same in tasks list and originalTasks list

    const isActiveATask = active.data.current?.type === "Task";
    const isOverAColumn = over.data.current?.type === "Column";
    const isOverATask = over.data.current?.type === "Task";
    console.log(
      `onDragEnd activeTaskId = ${activeTaskId} overId = ${overId}  isActiveATask = ${isActiveATask}  isOverAColumn=${isOverAColumn} isOverATask=${isOverATask}`
    );

    if (isActiveATask && isOverAColumn && activeTaskId !== overId) {
      // Task moved to a different column
      const newColumnId = overId;

      // Compare to original tasks to check if the task's column has changed
      const originalTask = originalTasks.find(
        (task) => task.id === activeTaskId
      );
      if (originalTask?.columnId !== newColumnId) {
        // Call backend to update the task's column
        ApiClient.put(`/tasks/${activeTaskId}/move-column`, { newColumnId })
          .then(() => {
            ApiClient.get<Task[]>("/tasks").then(setTask);
          })
          .catch((error) => {
            console.error(`Error moving task: ${error}`);
          });
      }
    } else if (isActiveATask && isOverATask && activeTaskId !== overId) {
      // Call backend to reorder tasks
      console.log(" Task are in the same colum");
      ApiClient.put("/tasks/swap", { taskId1: activeTaskId, taskId2: overId })
        .then(() => {
          ApiClient.get<Task[]>("/tasks").then(setTask);
        })
        .catch((error) => {
          console.error(`Error swapping tasks: ${error}`);
        });
    }
  }

  /**
   * Generate Id
   */

  function generateId() {
    return Math.floor(Math.random() * 1000001);
  }

  /**
   * Create new column
   */
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

  /**
   *
   * Delete column
   */

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

  /**
   *  Update column
   * @param id
   * @param title
   */

  async function updateColumn(id: Id, title: string) {
    try {
      await ApiClient.put(`/columns/${id}`, { title });
      const columns = await ApiClient.get<Column[]>("/columns");
      setColumn(columns);
    } catch (error) {
      console.error(`Error occurred when updating a column = ${error}`);
    }
  }

  /**
   *
   * Create Task
   * @param columnId
   */
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

  /**
   *
   * Delete Task
   * @param id
   */

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

  /**
   * Update Task
   * @param id
   * @param content
   */

  async function updateTask(id: Id, content: string) {
    try {
      await ApiClient.put(`/tasks/${id}/content`, { content });
      const tasks = await ApiClient.get<Task[]>("/tasks");
      setTask(tasks);
    } catch (error) {
      console.error(`Error occurred when calling the api ${error}`);
    }
  }

  useEffect(() => {
    const fetchColumnsAndTasks = async function getAllColumnsAndTask() {
      try {
        const tasks = await ApiClient.get<Task[]>("/tasks");
        setTask(tasks);
        const columns = await ApiClient.get<Column[]>("/columns");
        console.log(
          `API call response , all columns == ${JSON.stringify(columns)}`
        );
        setColumn(columns);
      } catch (error) {
        console.error(
          `Error occurred when fetching tasks and columns ${error}`
        );
      }
    };
    fetchColumnsAndTasks();
  }, []);

  return (
    <div className=" m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        //   onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsIds}>
              {columns.map((column) => (
                <div key={`column-${column.id}`}>
                  <ColumnContainer
                    key={column.id}
                    column={column}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    createTask={createTask}
                    tasks={tasks.filter((task) => task.columnId === column.id)}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    // index={index}
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
                // index={columns.indexOf(activeColumn)}
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

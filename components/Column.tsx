import { Todo, TypedColumn } from "@/typing";
import React from "react";
import { Draggable, Droppable, DroppableProvided } from "react-beautiful-dnd";
import TodoCard from "./TodoCard";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

type Props = {
  id: TypedColumn;
  todos: Todo[];
  index: number;
};

const idToColumnText: {
  [key in TypedColumn]: string;
} = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

const Column = ({ id, todos, index }: Props) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => {
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {/*render droppable todos column*/}
            <Droppable droppableId={index.toString()} type="card">
              {(provided, snapshot) => {
                return (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={` p-2 rounded-2xl shadow-sm ${
                      snapshot.isDraggingOver ? "bg-green-200" : "bg-white/50"
                    } `}
                  >
                    <h2 className="flex justify-between font-bold text-xl">
                      {idToColumnText[id]}
                      <span className="text-gray-500 bg-gray-200 rounded-full px-2 py-1 text-sm font-normal">
                        {todos.length}
                      </span>
                    </h2>
                    <div className="space-y-2 py-2">
                      {todos.map((todo, index) => (
                        <Draggable
                          draggableId={todo.$id}
                          key={todo.$id}
                          index={index}
                        >
                          {(provided) => (
                            /*render droppable todos list*/
                            <TodoCard
                              todo={todo}
                              index={index}
                              id={id}
                              draggableProps={provided.draggableProps}
                              dragHandleProps={provided.dragHandleProps}
                              innerRef={provided.innerRef}
                            />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      <div className="flex items-end justify-end p-2">
                        <button
                          type="button"
                          className="text-green-500 hover:text-green-600"
                        >
                          <PlusCircleIcon className="h-10 w-10 " />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }}
            </Droppable>
          </div>
        );
      }}
    </Draggable>
  );
};

export default Column;
